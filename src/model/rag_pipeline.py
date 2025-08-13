import re, os, logging, pickle, faiss, numpy as np, difflib
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from openai import OpenAI
from nltk.corpus import stopwords

# config & setup
load_dotenv()
#openai.api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# FAISS indexes & their metadata
gene_index = faiss.read_index("gene_meta_index.faiss")
with open("gene_docs.pkl","rb") as f: gene_docs = pickle.load(f)

ccre_index = faiss.read_index("ccre_meta_index.faiss")
with open("ccre_docs.pkl","rb") as f: ccre_docs = pickle.load(f)

embedder = SentenceTransformer("all-MiniLM-L6-v2")
VECTOR_THRESHOLD, TOP_K = 0.5, 5

# regex for region routing
ID_REGEX = re.compile(r"\b[A-Za-z][A-Za-z0-9\.-]*\b")
CHR_REGEX   = re.compile(r"\b(?:chr|chrom|chromosome)\s*([1-9]|1[0-9]|2[0-2]|X|Y|M)\b", re.I)
RANGE_REGEX = re.compile(r"\b(\d{1,9})\s*(?:[-–]|to|\s+)\s*(\d{1,9})\b", re.I)
ACCESSION_REGEX = re.compile(r"\b(EH\d+E\d+)\b", re.I)
FULL_REGION_REGEX = re.compile(
    r"^\s*([1-9]|1[0-9]|2[0-2]|X|Y|M)\s+(\d{1,9})\s+(\d{1,9})\s*$",
    re.I
)

# regex to decide enhancer vs variant vs plain-gene
ENH_RE = re.compile(r"\b(enhancer|icre)s?\b", re.I)
VAR_RE = re.compile(r"\b(rs\d+|eQTL|variant)s?\b", re.I)

# helper stays the same
def generate_response(url: str, snippets: list[str], user_q: str) -> str:
    prompt = f"User asked: {user_q}\n\n"
    if snippets:
        prompt += "Here are some relevant excerpts:\n"
        for i, snip in enumerate(snippets, 1):
            prompt += f"{i}. {snip}\n\n"
    prompt += (
        f"Please write a concise, friendly answer and include this link:\n{url}\n\n"
        "Answer:"
    )
    resp = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.0,
    )
    return resp.choices[0].message.content.strip()


def rag_region(q: str, chrom: str, start: int, end: int) -> str:
    url = f"https://igscreen.wenglab.org/region/chr{chrom}:{start}-{end}/icres"
    emb = embedder.encode(q, normalize_embeddings=True, convert_to_numpy=True).astype("float32")
    _, I = ccre_index.search(np.array([emb]), k=3)
    snippets = [ccre_docs[idx]["text"] for idx in I[0]]
    return generate_response(url, snippets, q)


def rag_gene(q: str, gene: str) -> str:
    url = f"https://igscreen.wenglab.org/gene/{gene}"
    return generate_response(url, [], q)


def rag_icre(q: str, gene: str) -> str:
    url = f"https://igscreen.wenglab.org/gene/{gene}/icres"
    return generate_response(url, [], q)


def rag_variant(q: str, variant: str) -> str:
    url = f"https://igscreen.wenglab.org/gene/variant/{variant}"
    return generate_response(url, [], q)

def rag_accession(q: str, accession: str) -> str:
    url = f"https://igscreen.wenglab.org/icre/{accession}"
    emb = embedder.encode(q, normalize_embeddings=True, convert_to_numpy=True).astype("float32")
    _, I = ccre_index.search(np.array([emb]), k=1)
    snippet = ccre_docs[I[0][0]]["text"]
    return generate_response(url, [snippet], q)


def rag_lineage(q: str) -> str:
    url = "https://igscreen.wenglab.org/lineage"
    return generate_response(url, [], q)

# hybrid gene extractor
VALID_GENES = {doc["id"].upper() for doc in gene_docs}

def ensure_gene(raw: str) -> str | None:
    # 1) direct token match
    for tok in re.findall(r"\b[A-Za-z][A-Za-z0-9\.-]*\b", raw):
        up = tok.upper()
        if up in VALID_GENES:
            return up
    return None

VALID_ACCESSIONS = {doc["id"].upper() for doc in ccre_docs}

def ensure_accession(raw: str) -> str | None:
    for tok in re.findall(ACCESSION_REGEX, raw):
        up = tok.upper()
        if up in VALID_ACCESSIONS:
            return up
        # 2) Optional fuzzy:
        matches = difflib.get_close_matches(up, VALID_ACCESSIONS, n=1, cutoff=0.8)
        if matches: return matches[0]
    return None

# Need to make it use faiss index
VARIANTS_REGEX = re.compile(r"\b(rs\d+)\b", re.I)

def ensure_variants(raw: str) -> str | None:
    for tok in re.findall(VARIANTS_REGEX, raw):
        up = tok.upper()
        if up != "RS1":
            return up
    return None

# for the possibility of lineage searches
LINEAGE_TERMS = ["hematopoetic", "atac", "dnase", "progenitor", "erythroblast", "plasmacytoid", "myeloid",
                    "monocyte", "macrophage", "natural killer", "double negative", "immature", "mature", "memory",
                    "effector", "regulatory", "helper", "plasmablast", "b cell", "cd8", "t cell", "double positive", 
                    "stem cell", "gamma delta t"]

PLOT_TERMS = ["plot", "graph", "upset"]

def ensure_lineage(raw: str) -> bool:
    text = raw.lower()

    has_plot_term = any(term in text for term in PLOT_TERMS)

    has_lineage_term = any(term in text for term in LINEAGE_TERMS)

    return has_plot_term and has_lineage_term

STOP = set(stopwords.words("english"))


def lookup_token(tok: str) -> str | None:
    up = tok.upper()

    # 1) Exact match
    if up in VALID_GENES:
        return up

    # 2) Letter-only fuzzy match
    if tok.isalpha() and 3 <= len(tok) <= 5:
        fuzzy = difflib.get_close_matches(up, VALID_GENES, n=2, cutoff=0.8)
        if fuzzy:
            return fuzzy[0]

    # 3) Digit-containing: first try vector, then (if you like) fuzzy
    if re.search(r"\d", tok):
        emb = embedder.encode(tok, normalize_embeddings=True, convert_to_numpy=True).astype("float32")
        scores, idxs = gene_index.search(np.array([emb]), k=1)
        if scores[0][0] >= VECTOR_THRESHOLD:
            return gene_docs[idxs[0][0]]["id"]
        fuzzy = difflib.get_close_matches(up, VALID_GENES, n=2, cutoff=0.8)
        if fuzzy:
            return fuzzy[0]

    # 4) everything else → no match
    return None

def get_gene_suggestions(user_q: str, n: int = 5) -> list[str]:
    tokens = re.findall(ID_REGEX, user_q)
    candidates = [
        t for t in tokens
        if (len(t) >= 4 or re.search(r"\d", t))
           and t.lower() not in STOP
    ]

    suggestions = []
    for tok in candidates:
        match = lookup_token(tok)
        if match and match not in suggestions:
            suggestions.append(match)
        if len(suggestions) >= n:
            break

    return suggestions


def call_openai_fallback(prompt):
    fallback_prompt = (
        "You are a bioinformatics helper trying to provide redirection. "
        f"Try to answer your best from:\n'{prompt}'"
    )
    try:
        resp = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": fallback_prompt}],
            temperature=0.0,
        )
        return resp.choices[0].message.content.strip()
    except Exception as e:
        return f"(OpenAI fallback failed: {e})"

# main chat loop
def main():
    print("🔎 igSCREEN assistant ('exit' to quit)")
    while True:
        q = input("You: ").strip()
        if not q or q.lower()=="exit":
            break
        logging.info("User: %s", q)

        acc = ensure_accession(q)
        if acc:
            answer = rag_accession(q, acc)

        elif ensure_lineage(q):
            answer = rag_lineage(q)

        # 1) region?
        else:
            full_rm = FULL_REGION_REGEX.match(q)
            if full_rm:
                # user just pasted: chr start end
                chr_, a, b = full_rm.group(1).upper(), int(full_rm.group(2)), int(full_rm.group(3))
                answer = rag_region(q, chr_, min(a, b), max(a, b))
            else:
                cm = CHR_REGEX.search(q)
                rm = RANGE_REGEX.search(q)
                if cm and rm:
                    chr_, a, b = cm.group(1).upper(), *map(int, rm.groups())
                    answer = rag_region(q, chr_, min(a, b), max(a, b))
                else:
                    var = ensure_variants(q)
                    if var:
                        answer = rag_variant(q, var)

                # 2) gene?
                    else:
                        gene = ensure_gene(q)
                        if gene:
                            if ENH_RE.search(q):
                                answer = rag_icre(q, gene)
                            else:
                                answer = rag_gene(q, gene)
                        else:
                            suggs = get_gene_suggestions(q)
                            if suggs:
                                print("\nI didn't find an exact gene match. Did you mean:")
                                for i, g in enumerate(suggs, start=1):
                                    print(f"  {i}. {g}")
                                print("  0. None of these / try something else")
                                choice = input("Pick a number: ").strip()
                                if choice.isdigit() and 1 <= int(choice) <= len(suggs):
                                    answer = rag_gene(q, suggs[int(choice)-1])
                                else:
                                    print("\nCould not map to a gene or region.")
                                    print("\nAssistant (OpenAI fallback):")
                                    answer = call_openai_fallback(q)
                            else:
                                # no suggestions at all → fallback
                                print("\nCould not map to a gene or region.")
                                print("\nAssistant (OpenAI fallback):")
                                answer = call_openai_fallback(q)
        print("Bot:", answer)
        logging.info("Bot: %s", answer)

    print("Goodbye!")

if __name__=="__main__":
    main()
