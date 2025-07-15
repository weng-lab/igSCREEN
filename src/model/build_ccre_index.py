# build_ccre_index_with_resume.py
import os
import glob
import pickle
import faiss
import numpy as np
import psycopg2
from tqdm import tqdm
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

load_dotenv()

DB_CONFIG = {
    "host":   os.getenv("DB_HOST"),
    "port":   int(os.getenv("CCRE_DB_PORT")),
    "user":   os.getenv("DB_USER"),
    "password": os.getenv("CCRE_DB_PASS"),
    "dbname": os.getenv("CCRE_DB_NAME")
}

BATCH_SIZE        = 1024
EMBED_MODEL       = "all-MiniLM-L6-v2"
FINAL_INDEX_PATH  = "ccre_meta_index.faiss"
FINAL_DOCS_PATH   = "ccre_docs.pkl"
CHECKPOINT_EVERY  = 100  # checkpoint every 100 batches

def stream_ccres():
    """
    Server‐side cursor to stream all rows.
    """
    conn = psycopg2.connect(**DB_CONFIG)
    cur  = conn.cursor(name="ccre_cursor")
    cur.execute("""
      SELECT accession, chromosome, start, stop, ccre_group
      FROM v4atacdata.grch38_ccres
    """)
    while True:
        batch = cur.fetchmany(BATCH_SIZE)
        if not batch:
            break
        for row in batch:
            yield row
    conn.close()

def find_latest_checkpoint():
    """
    Return the highest checkpoint N (int), or None if none exist.
    """
    files = glob.glob("ccre_meta_index_ckpt_*.faiss")
    idxs  = []
    for fn in files:
        basename = os.path.basename(fn)
        parts = basename.split("_")
        try:
            n = int(parts[-1].split(".")[0])
            idxs.append(n)
        except:
            pass
    return max(idxs) if idxs else None

def main():
    # 1) Pull all rows into memory (so we can index by offset)
    print("🔎 fetching cCRE rows…")
    all_rows = list(stream_ccres())
    n_rows   = len(all_rows)
    print(f"✅ fetched {n_rows:,} rows")

    # 2) Build full‐list of metadata strings
    full_docs  = []
    full_texts = []
    for acc, chrom, start, stop, grp in all_rows:
        txt = f"{acc} ({grp}) on {chrom}:{start}-{stop}  →  /icre/{acc}"
        full_docs.append({"id": acc, "text": txt})
        full_texts.append(txt)

    # 3) Prepare embedder (once)
    embedder = SentenceTransformer(EMBED_MODEL)
    dim      = embedder.get_sentence_embedding_dimension()

    # 4) Check for existing checkpoint
    last_ckpt = find_latest_checkpoint()
    if last_ckpt is not None:
        print(f"🔄 Resuming from checkpoint #{last_ckpt}")
        # load FAISS index
        index = faiss.read_index(f"ccre_meta_index_ckpt_{last_ckpt}.faiss")
        # load docs up to that batch
        with open(f"ccre_docs_ckpt_{last_ckpt}.pkl","rb") as f:
            docs = pickle.load(f)
        start_offset = last_ckpt * BATCH_SIZE
        print(f"   → already indexed {start_offset:,} / {n_rows:,} records")
    else:
        print("✨ No checkpoint found; starting fresh")
        index  = faiss.IndexFlatIP(dim)
        docs   = []
        start_offset = 0

    # 5) Embed + index in batches, checkpointing every CHECKPOINT_EVERY chunks
    print("🔎 embedding & indexing…")
    for i in tqdm(range(start_offset, n_rows, BATCH_SIZE), desc="Chunks"):
        batch_texts = full_texts[i : i + BATCH_SIZE]
        embb = embedder.encode(
            batch_texts,
            convert_to_numpy=True,
            normalize_embeddings=True
        ).astype("float32")
        index.add(embb)

        # append new docs
        docs.extend(full_docs[i : i + BATCH_SIZE])

        # checkpoint?
        chunk_num = (i // BATCH_SIZE) + 1
        if chunk_num % CHECKPOINT_EVERY == 0:
            print(f"\n💾 checkpointing at chunk {chunk_num} ({i + len(batch_texts)} records)…")
            faiss.write_index(index, f"ccre_meta_index_ckpt_{chunk_num}.faiss")
            with open(f"ccre_docs_ckpt_{chunk_num}.pkl","wb") as f:
                pickle.dump(docs, f)

    # 6) Final write
    print("✅ writing final index & docs")
    faiss.write_index(index, FINAL_INDEX_PATH)
    with open(FINAL_DOCS_PATH, "wb") as f:
        pickle.dump(docs, f)

    print("🎉 Done.")

if __name__ == "__main__":
    main()
