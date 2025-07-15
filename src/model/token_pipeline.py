import os
import re
import difflib
import psycopg2
from dotenv import load_dotenv
from functools import lru_cache
load_dotenv()

# 1) Regexes
# capture full “chr17” etc.
CHR_REGEX    = re.compile(r"\b(chr(?:om)?(?:[1-9]|1[0-9]|2[0-2]|X|Y|M))\b", re.IGNORECASE)
REGION_REGEX = re.compile(r"\b(\d{1,9})\s*(?:[-–]|to)\s*(\d{1,9})\b")
ID_REGEX     = re.compile(r"\b([A-Za-z][A-Za-z0-9\.-]*\d[A-Za-z0-9\.-]*)\b")

# 2) Portal bases
PORTALS = {
    "gene":   "https://igscreen.wenglab.org/gene",
    "region": "https://igscreen.wenglab.org/region"
}

# 3) DB helpers
def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        dbname=os.getenv("DB_NAME"),
    )

def get_ccre_connection(): 
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("CCRE_DB_PORT")),
        user=os.getenv("DB_USER"),
        password=os.getenv("CCRE_DB_PASS"),
        dbname=os.getenv("CCRE_DB_NAME"),
    )

def fetch_gene(sym: str) -> bool:
    with get_connection() as conn, conn.cursor() as cur:
        cur.execute(
            "SELECT 1 FROM gencode_02_29_2024.gene_grch38_29 WHERE name=%s LIMIT 1",
            (sym,),
        )
        return cur.fetchone() is not None

def fetch_ccre(chrom: str, start: int, end: int) -> bool:
    with get_ccre_connection() as conn, conn.cursor() as cur:
        cur.execute(
            "SELECT 1 FROM v4atacdata.grch38_ccres "
            "WHERE chromosome=%s AND start<=%s AND stop>=%s LIMIT 1",
            (chrom, end, start),
        )
        return cur.fetchone() is not None

# cache the full gene list once
@lru_cache(maxsize=1)
def load_all_genes() -> list[str]:
    with get_connection() as conn, conn.cursor() as cur:
        cur.execute("SELECT name FROM gencode_02_29_2024.gene_grch38_29")
        return [row[0] for row in cur.fetchall()]

# 4) Query parsing & fuzzy fallback
def parse_query(q):
    # gene
    m = ID_REGEX.search(q)
    gene = m.group(1).upper() if m else None

    # chromosome
    c = CHR_REGEX.search(q)
    chrom = c.group(1).lower() if c else None

    # region
    r = REGION_REGEX.search(q)
    if r:
        a, b = map(int, r.groups())
        start, end = (a, b) if a <= b else (b, a)
    else:
        start = end = None

    return gene, chrom, start, end

def fuzzy_gene(g):
    if fetch_gene(g):
        return g
    # single best close match
    choices = difflib.get_close_matches(g, load_all_genes(), n=1, cutoff=0.8)
    return choices[0] if choices else None

# 5) URL builders 
def build_gene_url(gene):
    return f"{PORTALS['gene']}/{gene}"

def build_region_url(chrom, start, end):
    return f"{PORTALS['region']}/{chrom}:{start}-{end}/icres"

# 6) Main handler
def handle_query(q):
    gene, chrom, start, end = parse_query(q)
    lines = []

    # 1) Gene portal link
    if gene:
        best = fuzzy_gene(gene)
        if best:
            lines.append(f"Gene Portal for **{best}**:\n  {build_gene_url(best)}")
        else:
            lines.append(f"I don't recognize “{gene}” as a valid HGNC symbol.")

    # 2) Region portal link
    if chrom and start is not None and end is not None:
        has = fetch_ccre(chrom, start, end)
        note = "" if has else " (no cCREs found in that span)"
        lines.append(
            f"🔗 Region Portal for {chrom}:{start}-{end}{note}:\n"
            f"  {build_region_url(chrom, start, end)}"
        )

    # 3) Fallback
    if not lines:
        return (
            "Sorry, I couldn't pull out a gene or a chromosomal region.\n"
            "Try e.g. “BRCA1” or “chr17 50-200 for BRCA1” or “chr5 1000-2000”."
        )

    return "\n\n".join(lines)

if __name__ == "__main__":
    print("🔎 igSCREEN token-only assistant (type 'exit' or 'quit' to leave)")
    while True:
        q = input("You: ").strip()
        if not q or q.lower() in ("exit", "quit"):
            print("Goodbye!")
            break
        answer = handle_query(q)
        print("Bot:", answer, "\n")

