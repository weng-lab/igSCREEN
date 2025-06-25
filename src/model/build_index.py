import faiss
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer
from set_up import load_all_genes
from tqdm import tqdm

# 1) Prepare your metadata “documents”
all_genes = load_all_genes()
gene_docs = [
    {
        "id": g,
        "text": (
            f"{g} Gene Portal: https://igscreen.wenglab.org/gene/{g}\n"
            f"{g} iCREs:       https://igscreen.wenglab.org/gene/{g}/icres\n"
            f"{g} Variants:    https://igscreen.wenglab.org/gene/{g}/variants"
        )
    }
    for g in all_genes
]

# Add the two global portal entries
gene_docs += [
    {"id": "Phenotype", "text": "Phenotype Portal: https://igscreen.wenglab.org/phenotype"},
    {"id": "Immune",    "text": "Immune Portal:    https://igscreen.wenglab.org/lineage"}
]

# Extract just the text for embedding
texts = [doc["text"] for doc in gene_docs]

# 2) Embed in batches with a progress bar
embedder   = SentenceTransformer("all-MiniLM-L6-v2")
batch_size = 128
all_embs   = []

for i in tqdm(range(0, len(texts), batch_size), desc="Embedding genes"):
    batch     = texts[i : i + batch_size]
    emb_batch = embedder.encode(
        batch,
        convert_to_numpy=True,
        normalize_embeddings=True
    ).astype("float32")
    all_embs.append(emb_batch)

embs = np.vstack(all_embs)

# 3) Build & save FAISS index in batches
index = faiss.IndexFlatIP(embs.shape[1])
for i in tqdm(range(0, len(embs), batch_size), desc="Indexing embeddings"):
    index.add(embs[i : i + batch_size])

faiss.write_index(index, "gene_meta_index.faiss")

# 4) Persist the metadata list
with open("gene_docs.pkl", "wb") as f:
    pickle.dump(gene_docs, f)

print("✅ Built gene_meta_index.faiss and gene_docs.pkl")
