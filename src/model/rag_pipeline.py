import re, os, pickle, faiss, openai, numpy as np, difflib
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

# config & setup
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

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


# regex to decide enhancer vs variant vs plain-gene
ENH_RE = re.compile(r"\b(enhancer|icre)s?\b", re.I)
VAR_RE = re.compile(r"\b(rs\d+|eQTL|variant)s?\b", re.I)


def rag_region(chrom: str, start: int, end: int) -> str:
    url = f"https://igscreen.wenglab.org/region/chr{chrom}:{start}-{end}/icres"
    return (
        f"🔎 Region view for chr{chrom}:{start}-{end}:\n"
        f"{url}\n\n"
        "Inspect cCREs by class and activity; click any element to drill down "
        "into its genomic context and associated genes."
    )

def rag_region_with_snippet(q, chrom, start, end):
    # 1) build URL + header
    url = f"https://igscreen.wenglab.org/region/chr{chrom}:{start}-{end}/icres"
    header = f"🔎 IGSCREEN view for chr{chrom}:{start}-{end}: {url}\n\n"

    # 2) retrieve just one doc
    emb = embedder.encode(q, normalize_embeddings=True, convert_to_numpy=True).astype("float32")
    _, I = ccre_index.search(np.array([emb]), k=1)
    snippet = ccre_docs[I[0][0]]["text"]

    return header + "Top match:\n• " + snippet

def rag_gene(gene: str) -> str:
    url = f"https://igscreen.wenglab.org/gene/{gene}"
    return (
        f"🧬 Gene overview for {gene}:\n"
        f"{url}\n\n"
        "Explore expression tracks, regulatory annotations, and links to relevant "
        "icRE and variant pages."
    )

def rag_icre(gene: str) -> str:
    url = f"https://igscreen.wenglab.org/gene/{gene}/icres"
    return (
        f"✨ Here’s the IGSCREEN link for {gene} cCREs:\n"
        f"{url}\n\n"
        "You can further filter by cCRE class (promoter, enhancer, CTCF) "
        "and by cell‑type activity using our interactive table and viewer."
    )

def rag_variant(gene: str) -> str:
    url = f"https://igscreen.wenglab.org/gene/{gene}/variants"
    return (
        f"🔬 Variant annotations for {gene}:\n"
        f"{url}\n\n"
        "Browse eQTLs, GWAS hits, and somatic variants in our table; "
        "use the filters to hone in on cell‑type or disease context."
    )


# hybrid gene extractor
VALID_GENES = {doc["id"].upper() for doc in gene_docs}

def ensure_gene(raw: str) -> str | None:
    # 1) direct token match
    for tok in re.findall(r"\b[A-Za-z][A-Za-z0-9\.-]*\b", raw):
        up = tok.upper()
        if up in VALID_GENES:
            return up

    # 2) fuzzy match using your list
    matches = difflib.get_close_matches(up, VALID_GENES, n=1, cutoff=0.75)
    if matches:
        return matches[0]

    return None


# main chat loop
def main():
    print("🔎 igSCREEN assistant ('exit' to quit)")
    while True:
        q = input("You: ").strip()
        if not q or q.lower()=="exit":
            break

        # 1) region first
        cm = CHR_REGEX.search(q)
        rm = RANGE_REGEX.search(q)
        if cm and rm:
            chr_, a, b = cm.group(1).upper(), *map(int, rm.groups())
            print("Bot:", rag_region(chr_, min(a, b), max(a, b)))
            continue

        # 2) gene next
        gene = ensure_gene(q)
        if gene:
            if ENH_RE.search(q):
                print("Bot:", rag_icre(gene))
            elif VAR_RE.search(q):
                print("Bot:", rag_variant(gene))
            else:
                print("Bot:", rag_gene(gene))
            continue

        # 3) fallback
        print("Bot: Sorry, couldn't find a gene or region — "
              "try “SPIB enhancers” or “chr12 100-200.”")

    print("Goodbye!")

if __name__=="__main__":
    main()
