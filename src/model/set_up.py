import os
import psycopg2
import re
from dotenv import load_dotenv


load_dotenv()

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


# -- Load all genes
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
