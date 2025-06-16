import os
import re
import psycopg2
import openai
import numpy as np
import faiss
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from queryclassifier import QueryClassifier
from model import Fallback_Model
import pickle

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

ID_REGEX = re.compile(r"\b([A-Za-z][A-Za-z0-9\.-]*\d[A-Za-z0-9\.-]*)\b")
LINK_REGEX = re.compile(r"\b(Gene Portal|iCRE Portal|Variant Portal|Phenotype|Immune)\b", re.IGNORECASE)
PREFIX_RE = re.compile(
    r"^(?:i am looking for|looking for|search(?: for)?|what is|show me)\s+",
    re.IGNORECASE
)
GENE_BOILERPLATE = re.compile(
    r"\bgenes?\s+(?:related to|associated with|for)\b", 
    flags=re.IGNORECASE
)
VECTOR_THRESHOLD = 0.5
TOP_K = 5

def get_connection():
    return psycopg2.connect(
        host = os.getenv("DB_HOST"),
        port = int(os.getenv("DB_PORT")),
        user = os.getenv("DB_USER"),
        password = os.getenv("DB_PASS"),
        dbname = os.getenv("DB_NAME")
    )

def fetch_genome(genome_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT name, gene_type FROM gencode_02_29_2024.gene_grch38_29 WHERE name = %s",
                (genome_id,)
            )
            row = cur.fetchone()
            return {"name": row[0], "description": row[1]} if row else None
    finally:
        conn.close()

def load_genome():
    """Return a list of every gene symbol in your table."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT name
                  FROM gencode_02_29_2024.gene_grch38_29
            """)
            return [row[0] for row in cur.fetchall()]
    finally:
        conn.close()

def load_link(): 
    return ["Gene Portal", "iCRE Portal", "Variant Portal", "Phenotype", "Immune"]

def fetch_link(link):
    dummy_db = {
        "Gene Portal": {
            "description": "Explore gene expression across immune cell types at bulk and single-cell resolution for 43 cell types across 312 experiments.",
            "link":        "https://igscreen.wenglab.org/gene",
        },
        "iCRE Portal": {
            "description": "Explore regulatory element activity (immune cCREs) across immune cell types at bulk and single-cell resolution for 63 cell types across 736 experiments.",
            "link":        "https://igscreen.wenglab.org/icre",
        },
        "Variant Portal": {
            "description": "Search variants of interest and explore their impact on gene expression, chromatin accessibility, and other molecular traits in immune cells.",
            "link":        "https://igscreen.wenglab.org/variant",
        },
        "Phenotype": {
            "description": "Select between 400 phenotypes to explore heritability enrichment within 736 immune cell experiments.",
            "link":        "https://igscreen.wenglab.org/phenotype",
        },
        "Immune": {
            "description": "Compare immune cCRE activity between immune cell types.",
            "link":        "https://igscreen.wenglab.org/lineage",
        },
    }
    return dummy_db.get(link)

def provide_gene_links(gene_id, all_portals):
    print(f"Assistant: Portal links for {gene_id}:")
    for portal in all_portals:
        rec = fetch_link(portal)
        if rec: print(f"  {portal}: {rec['link']}/{gene_id}")

def normalize_query(text):
    text = GENE_BOILERPLATE.sub("", text)
    text = PREFIX_RE.sub("", text)
    text = re.sub(r"\bgene\b$", "", text, flags=re.IGNORECASE)
    return text.strip()

def extract_gene_id(text):
    m = ID_REGEX.search(text)
    return m.group(1).upper() if m else None

def extract_link_name(text, all_known):
    m = LINK_REGEX.search(text)
    if not m: return None
    f = m.group(1)
    return next((k for k in all_known if k.lower()==f.lower()), None)

embedder = SentenceTransformer("microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract")

index = faiss.read_index("gene_desc_index.faiss")
with open("gene_desc_ids.pkl","rb") as f: gene_ids = pickle.load(f)

def semantic_search(query):
    emb = embedder.encode(
        query,
        convert_to_numpy=True,
        normalize_embeddings=True
    ).astype("float32")
    D, I = index.search(np.array([emb]), TOP_K)
    return [(gene_ids[i], float(D[0,j])) for j,i in enumerate(I[0])]

#LLM FALLBACK 
def openai_fallback(query):
    prompt = (
        f"List up to {TOP_K} human gene symbols most closely associated with:\n“{query}”\n"
        "Return a comma-separated list only."
    )
    resp = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[{"role":"user","content":prompt}],
        temperature=0.0,
    )
    genes = [g.strip().upper() for g in re.split(r"[,\n]+", resp.choices[0].message.content)]
    return genes[:TOP_K]

def main():
    qc = QueryClassifier()
    fm = Fallback_Model(
        biobert_model_name="pritamdeka/BioBERT-mnli-snli-scinli-scitail-mednli-stsb",
        device=None, 
        lexical_threshold=0.80,
        semantic_threshold=0.75, 
        sequence_threshold=0.80
    )
    all_link = load_link()
    all_genome_ids = load_genome()

    print("Assistant: Hi! How can I assist you today?")
    while True:
        raw = input("User: ").strip()
        if not raw:
            continue
        if raw.lower().startswith(("exit","bye","thanks")):
            print("Assistant: Bye!")
            break

        # 0) Portal shortcuts
        portal = extract_link_name(raw, all_link)
        if portal:
            rec = fetch_link(portal)
            if rec:
                print(f"Assistant: Here's the {portal}:")
                print(f"  Description: {rec['description']}")
                print(f"  URL:         {rec['link']}")
            else:
                print(f"Assistant: Sorry, I don't have a link for {portal} right now.")
            continue

        # 1) Try to pull out an explicit gene symbol *first* (from raw)
        gene = extract_gene_id(raw)
        if gene:
            rec = fetch_genome(gene.upper())
            if rec:
                print(f"Assistant: Found exact match for {gene}:")
                print(f"  Description     : {rec['description']}")
                print(f"  Gene Portal URL : https://igscreen.wenglab.org/gene/{gene}")
                provide_gene_links(gene, all_link)
            else:
                # fuzzy‐match via your Fallback_Model
                best = fm.find_best_match(
                    query=gene,
                    candidates=all_genome_ids,
                    query_sequence=None,
                    db_path="",
                    k=5
                )
                mode, topk = best["mode"], best["topk"]
                if mode in ("lexical","semantic","sequence"):
                    print(f"Assistant: Didn't find '{gene}', but here are top {mode} suggestions:")
                    for i, (cand, score) in enumerate(topk[mode],1):
                        print(f"  {i}. {cand} (score {score:.2f})")
                    choice = input("Which one? ").strip()
                    if choice.isdigit():
                        sel = topk[mode][int(choice)-1][0]
                        rec = fetch_genome(sel)
                        print(f"Assistant: Here's '{sel}': {rec['description']}")
                        provide_gene_links(sel, all_link)
                else:
                    print(f"Assistant: Sorry, I couldn't find anything close to '{gene}'.")
            continue

        # normalize for next steps
        cleaned = normalize_query(raw)

        # 2) UI/help intents
        qc_res = qc.classify_query(re.sub(r"\bgene\b$", "", cleaned, flags=re.IGNORECASE))
        intent = qc_res["intent"]
        confidence = qc_res["confidence"]
        if intent =="ui_help" and confidence>=0.8:
            print("Assistant: To browse genomes, click 'Search' → enter the gene ID → hit 'Go'.")
            print("Or say “Show me the Gene Portal” to jump to that page.")
            continue
        if intent =="genome_help" and confidence>=0.8:
            print("Assistant: To look up a gene, type or paste its symbol (e.g. TP53).")
            print("Or describe what you’re looking for (e.g. “breast cancer gene”).")
            continue

        # 3) Semantic vector search
        cands = semantic_search(cleaned)
        if cands and cands[0][1]>=VECTOR_THRESHOLD:
            print("Assistant: Top semantic matches:")
            for i,(sym,sc) in enumerate(cands,1):
                print(f"  {i}. {sym} (score {sc:.2f})")
            choice = input("Which one? ").strip()
            if choice.isdigit():
                sel = cands[int(choice)-1][0]
                rec = fetch_genome(sel)
                print(f"Assistant: Here's {sel}: {rec['description']}")
                provide_gene_links(sel, all_link)
            continue

        # 4) LLM fallback
        genes = openai_fallback(cleaned)
        if genes:
            print("Assistant: You might also try these genes:")
            for g in genes:
                print(f"  • {g}")
            continue

        # 5) Last resort
        print("Assistant: Sorry, I couldn't find any genes for that query.")

if __name__ == "__main__":
    main()
