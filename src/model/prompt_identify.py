import os
import re
import json
import pickle
import logging
from functools import lru_cache
from dotenv import load_dotenv
import psycopg2
import openai
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from queryclassifier import QueryClassifier
from model import Fallback_Model

# --- Setup ---
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
logging.basicConfig(
    filename="assistant.log",
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)
logger = logging.getLogger(__name__)

# --- Regex & Thresholds ---
ID_REGEX = re.compile(r"\b([A-Za-z][A-Za-z0-9\.-]*\d[A-Za-z0-9\.-]*)\b")
UI_HELP_REGEX = re.compile(r"\b(redirect|click|navigate|help|how to|show me|go to|portal)\b", re.IGNORECASE)
GENE_KEYWORD_RE = re.compile(r"\bgene\b", re.IGNORECASE)
GENERAL_Q_RE = re.compile(r"\b(what is|what are|define|describe|explain)\b", re.IGNORECASE)
GENELIST_Q_RE = re.compile(r"\b(what can you do | help)\b", re.IGNORECASE)
BRUH_Q_RE = re.compile(r"\bbruh\b", re.IGNORECASE)
VECTOR_THRESHOLD = 0.5
TOP_K = 5

# --- Database Utilities ---
def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        dbname=os.getenv("DB_NAME")
    )

def fetch_genome(genome_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT name, gene_type FROM gencode_02_29_2024.gene_grch38_29 WHERE name=%s",
                (genome_id,)
            )
            row = cur.fetchone()
            return {"name": row[0], "description": row[1]} if row else None
    finally:
        conn.close()

# --- Load full gene list ---
def load_all_genes():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT name FROM gencode_02_29_2024.gene_grch38_29")
            return [r[0] for r in cur.fetchall()]
    finally:
        conn.close()

_all_genes = load_all_genes()

# --- Portal Links ---
def fetch_link(name):
    dummy = {
        "Gene Portal":   {"description":"Explore genes","link":"https://igscreen.wenglab.org/gene"},
        "iCRE Portal":   {"description":"Explore iCREs","link":"https://igscreen.wenglab.org/icre"},
        "Variant Portal":{"description":"Explore variants","link":"https://igscreen.wenglab.org/variant"},
        "Phenotype":     {"description":"Explore phenotypes","link":"https://igscreen.wenglab.org/phenotype"},
        "Immune":        {"description":"Compare immune lineages","link":"https://igscreen.wenglab.org/lineage"},
    }
    return dummy.get(name)

# --- Models & Embeddings ---
_qc = QueryClassifier()
_fm = Fallback_Model(
    biobert_model_name="pritamdeka/BioBERT-mnli-snli-scinli-scitail-mednli-stsb",
    device=None,
    lexical_threshold=0.80,
    semantic_threshold=0.75,
    sequence_threshold=0.80
)
embedder = SentenceTransformer("microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract")
_index = faiss.read_index("gene_desc_index.faiss")
with open("gene_desc_ids.pkl","rb") as f:
    _gene_ids = pickle.load(f)

# --- Typo-Tolerance (Levenshtein ≤1) ---
def is_edit_distance_le_one(s, t):
    if abs(len(s) - len(t)) > 1:
        return False
    prev = list(range(len(t) + 1))
    for i, cs in enumerate(s, start=1):
        curr = [i] + [0] * len(t)
        row_min = curr[0]
        for j, ct in enumerate(t, start=1):
            cost = 0 if cs == ct else 1
            curr[j] = min(prev[j] + 1, curr[j-1] + 1, prev[j-1] + cost)
            row_min = min(row_min, curr[j])
        if row_min > 1:
            return False
        prev = curr
    return prev[-1] <= 1

# --- 1) Intent Classification ---
def classify_intent(raw):
    text = raw.lower()
    # 1) gene-specific if a known gene symbol is mentioned
    if ID_REGEX.search(raw) and fetch_genome(ID_REGEX.search(raw).group(1).upper()):
        logger.info(f"intent=gene_specific by gene regex '{raw}'")
        return "gene_specific", 1.0
    # 2) UI help (redirect, portal, navigate)
    if UI_HELP_REGEX.search(text):
        logger.info(f"intent=ui_help by rule '{raw}'")
        return "ui_help", 1.0
    # 3) general help
    if GENELIST_Q_RE.search(text):
        return "general_help", 1.0
    # 4) general biology question trigger
    if GENERAL_Q_RE.search(text):
        logger.info(f"intent=general_question by general question regex '{raw}'")
        return "general_question", 1.0
    # 5) easter egg
    if BRUH_Q_RE.search(text):
        return "bruh", 1.0
    # 6) fallback to ML classifier
    res = _qc.classify_query(raw)
    intent, conf = res["intent"], res["confidence"]
    logger.info(f"intent={intent} conf={conf:.2f} by model '{raw}'")
    return (intent, conf) if conf >= 0.6 else ("general_question", conf)

# --- 2) General Q&A & UI Help (Cached) --- & UI Help (Cached) ---
@lru_cache(maxsize=128)
def answer_general(raw):
    prompt = (
        "You are an assistant. Decide if the user wants gene biology info or site navigation help."
        f"\nUser: \"{raw}\""
    )
    resp = openai.chat.completions.create(
        model="gpt-4o", messages=[{"role":"user","content":prompt}], temperature=0.0
    )
    return resp.choices[0].message.content.strip()

# --- 3) Gene Extraction Pipeline ---
def extract_gene_candidates(raw):
    # 1) exact match
    m = ID_REGEX.search(raw)
    if m:
        cand = m.group(1).upper()
        if fetch_genome(cand):
            return [cand]

    # 2) lexical fallback over full list
    best = _fm.find_best_match(
        query=raw,
        candidates=_all_genes,
        query_sequence=None,
        db_path="",
        k=TOP_K
    )
    if best["mode"] == "lexical":
        return [c for c, _ in best["topk"]["lexical"]]

    # 3) typo tolerance (Levenshtein ≤1)
    up = raw.strip().upper()
    typos = [g for g in _all_genes if is_edit_distance_le_one(up, g)]
    if typos:
        return typos[:TOP_K]

    # 4) semantic via FAISS
    emb = embedder.encode(raw, convert_to_numpy=True, normalize_embeddings=True).astype("float32")
    D, I = _index.search(np.array([emb]), TOP_K)
    if D[0][0] >= VECTOR_THRESHOLD:
        return [_gene_ids[i] for i in I[0]]

    # 5) LLM fallback
    prompt = f"List up to {TOP_K} human gene symbols associated with:\n'{raw}'\nComma-separated only."
    resp = openai.chat.completions.create(
        model="gpt-4o",
        messages=[{"role":"user","content":prompt}],
        temperature=0.0
    )
    return [g.strip().upper() for g in re.split(r"[,\\n]+", resp.choices[0].message.content)]

# --- 4) Slot-Filling & Redirect ---
def parse_and_redirect(user_query, gene):
    # slot extraction
    prompt = (
        "JSON extract: gene, portal (Gene/iCRE/Variant Portal), icre_class (promoter,enhancer,enhancer_proximal,enhancer_distal,CA-H3K4me3,CA-CTCF,CA-TF,CA,TF), variant (true/false)."
        f"\nUser: '{user_query}'\nGene: '{gene}'"
    )
    resp = openai.chat.completions.create(model="gpt-4o", messages=[{"role":"user","content":prompt}], temperature=0.0)
    try:
        slots = json.loads(resp.choices[0].message.content)
    except:
        slots = {}
    text = user_query.lower()
    # keyword injection for icre_class
    if not slots.get("icre_class"):
        if "promoter" in text: slots["icre_class"] = "promoter"
        elif "enhancer" in text:
            if "distal" in text: slots["icre_class"] = "enhancer_distal"
            elif "proximal" in text: slots["icre_class"] = "enhancer_proximal"
            else: slots["icre_class"] = "enhancer"
    # set portal based on slots
    if slots.get("icre_class"): slots["portal"] = "iCRE Portal"
    if "variant" in text and not slots.get("variant"): slots["variant"] = True
    # defaults
    portal = slots.get("portal","Gene Portal")
    ic = slots.get("icre_class")
    var = slots.get("variant",False)
    # build URL
    base = f"https://igscreen.wenglab.org/gene/{gene}"
    if portal == "iCRE Portal" or ic:
        return f"{base}/icres"
    if portal == "Variant Portal" or var:
        return f"{base}/variants"
    return base

# --- 5) General Gene Help & Redirect ---
def handle_gene_query(raw):
    # extract candidates as before, select gene
    cands = extract_gene_candidates(raw)
    if not cands:
        print("No matching genes.")
        return
    gene = cands[0] if len(cands)==1 else cands[int(input(f"Choices {cands}: "))-1]
    print(f"Selected gene: {gene}")
    # ambiguous general query? both answer + redirect
    if GENERAL_Q_RE.search(raw):
        print("-> Answer:", answer_general(raw))
    # perform slot extraction & redirect
    url = parse_and_redirect(raw, gene)
    print(f"-> Redirect to {url}")

# --- Test Harness ---
if __name__ == "__main__":
    print("🛠️ Test pipeline (type 'exit').")
    while True:
        q = input("Query: ").strip()
        if not q or q.lower().startswith("exit"): break
        intent, conf = classify_intent(q)
        print(f"-> intent={intent} (conf={conf:.2f})")
        if intent == "ui_help":
            print("-> UI Help:", fetch_link("Gene Portal")["link"] if "gene portal" in q.lower() else "See site map")
            continue
        if intent == "general_question":
            print("-> Answer:", answer_general(q))
            continue
        if intent == "general_help":
            print("-> I can look up genes, iCRE classes, variants, and provide links. Try “What is BRCA1?” or “Show me the iCRE portal.”")
            continue
        if intent == "gene_specific":
            handle_gene_query(q)
            continue
        if intent == "bruh":
            print("BRUHHHHHHHHHHHHHHHHHHHHH")
            continue
        # gene pipeline
        cands = extract_gene_candidates(q)
        if not cands:
            print("-> No genes found.")
            continue
        gene = cands[0] if len(cands)==1 else cands[int(input(f"Choices {cands}: "))-1]
        print(f"-> selected: {gene}")
        url = parse_and_redirect(q, gene)
        print(f"-> Redirect to {url}")
    print("Done.")

