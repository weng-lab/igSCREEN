import os
import pickle
import psycopg2
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return psycopg2.connect(
        host    = os.getenv("DB_HOST"),
        port    = int(os.getenv("DB_PORT")),
        user    = os.getenv("DB_USER"),
        password= os.getenv("DB_PASS"),
        dbname  = os.getenv("DB_NAME"),
    )

def load_metadata():
    """
    Pull every gene symbol and embed that symbol string.
    """
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT name
                  FROM gencode_02_29_2024.gene_grch38_29
            """)
            symbols = [row[0] for row in cur.fetchall()]
            return symbols
    finally:
        conn.close()

print("1) Loading gene metadata from your DB…")
symbols = load_metadata()
texts   = symbols
print(f"   → Found {len(symbols)} genes")

print("2) Embedding gene symbols…")
embedder = SentenceTransformer("microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract")
embs = embedder.encode(
    texts,
    convert_to_numpy=True,
    normalize_embeddings=True,
    batch_size=64,
    show_progress_bar=True
).astype("float32")

print("3) Building FAISS index…")
d = embs.shape[1]
index = faiss.IndexFlatIP(d) 
index.add(embs)

print("4) Writing out index and IDs…")
faiss.write_index(index, "gene_desc_index.faiss")
with open("gene_desc_ids.pkl", "wb") as f:
    pickle.dump(symbols, f)

print("Done. You now have gene_desc_index.faiss + gene_desc_ids.pkl")
