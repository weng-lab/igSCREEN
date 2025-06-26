import re
import os
import pickle
import faiss
import openai
import numpy as np
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from model import Fallback_Model
from set_up import ID_REGEX, fetch_genome, load_all_genes, fetch_link
from functools import lru_cache

# ——— 0) UI‐steps few shot setup ——————————————————————————
SYSTEM_UI = {
    "role": "system",
    "content": (
      "You are a UI navigation expert for the igscreen web portal. "
      "Given the current URL and a user task, respond with a numbered, step-by-step list "
      "of exactly what to click or type."
    )
}

EXAMPLES = [
  {
    "user": "I'm on https://igscreen.wenglab.org/gene/BRCA1 and I want to look up enhancers.",
    "assistant": [
      "1. Click the “iCRE Portal” button in the top nav.",
      "2. In the “Gene” search box, type BRCA1.",
      "3. Hit Search.",
      "4. On the results page, click the “Enhancers” tab."
    ]
  },
  {
    "user": "I'm on https://igscreen.wenglab.org/gene/BRCA1/icres and only want proximal enhancers.",
    "assistant": [
      "1. Find the filter dropdown labelled “Distance to TSS.”",
      "2. Select “≤2 kb (proximal).”",
      "3. Click Apply filters.",
      "4. Scroll down to view the proximal enhancer list."
    ]
  },
  {
    "user": "I'm on https://igscreen.wenglab.org/gene/TP53/variants and want to search for rs28934576.",
    "assistant": [
      "1. In the “Variant ID” box, enter rs28934576.",
      "2. Press Enter or click the Search icon.",
      "3. Review the single-variant detail panel."
    ]
  },
]

# ——— 1) Load RAG index + docs + OpenAI key —————————————————
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

index = faiss.read_index("gene_meta_index.faiss")
with open("gene_docs.pkl", "rb") as f:
    gene_docs = pickle.load(f)

# ——— 2) Embedding model + fallback model ——————————————
embedder = SentenceTransformer("all-MiniLM-L6-v2")
_fm = Fallback_Model(
    biobert_model_name="pritamdeka/BioBERT-mnli-snli-scinli-scitail-mednli-stsb",
    device=None,
    lexical_threshold=0.80,
    semantic_threshold=0.75,
    sequence_threshold=0.80
)

VECTOR_THRESHOLD = 0.5
TOP_K = 5

# ——— 3) Lexical‐first “ensure_best_gene” —————————————————
def ensure_best_gene(raw: str) -> str | None:
    # 1) Exact regex + DB lookup
    m = ID_REGEX.search(raw)
    if m:
        cand = m.group(1).upper()
        if fetch_genome(cand):
            return cand
    # 2) Single best lexical match via Fallback_Model
    best = _fm.find_best_match(
        query=raw,
        candidates=load_all_genes(),
        query_sequence=None,
        db_path="",
        k=1
    )
    if best["mode"] == "lexical" and best["topk"]["lexical"][0][1] >= 0.80:
        return best["topk"]["lexical"][0][0]
    return None

# ——— 4) RAG responder ————————————————————————————————
def rag_respond(q: str, k: int = 3) -> str:
    q_emb = embedder.encode(q, normalize_embeddings=True, convert_to_numpy=True).astype("float32")
    D, I = index.search(np.array([q_emb]), k)
    ctx = "\n".join(f"- {gene_docs[i]['text']}" for i in I[0])
    system = {"role":"system","content":"You are a friendly genome-portal assistant. Use the context to guide the user."}
    user    = {"role":"user",  "content":f"Context:\n{ctx}\n\nUser: {q}\nAssistant:"}
    resp = openai.ChatCompletion.create(
        model="gpt-4o", messages=[system, user], temperature=0.0
    )
    return resp.choices[0].message.content.strip()

# ——— 5) UI‐steps few‐shot function ————————————————————————
def ui_help_steps(user_q: str) -> str:
    m = re.search(r"https?://\S+", user_q)
    if m:
        url = m.group(0)
        task = user_q.replace(url, "").strip()
    else:
        return "Sure—what page are you on? Please paste the full URL."
    msgs = [SYSTEM_UI]
    for ex in EXAMPLES:
        msgs.append({"role":"user",      "content": ex["user"]})
        msgs.append({"role":"assistant", "content": "\n".join(ex["assistant"])})

    msgs.append({"role":"user", "content": f"I'm on {url} and I want to {task}"})
    resp = openai.ChatCompletion.create(
        model="gpt-4o", messages=msgs, temperature=0.0
    )
    return resp.choices[0].message.content.strip()

# ——— 6) Quick regex buckets ————————————————————————————
GREETING_RE = re.compile(r"\b(hi|hello|how are you)\b", re.I)
PHENO_RE    = re.compile(r"\bphenotype\b", re.I)
IMMUNE_RE   = re.compile(r"\bimmune\b", re.I)
UI_STEPS_RE = re.compile(r"\b(how do i|how to|step-by-step|guide me)\b", re.I)

def classify_simple(raw: str) -> str:
    t = raw.lower()
    if GREETING_RE.search(t):
        return "greeting"
    if PHENO_RE.search(t):
        return "phenotype"
    if IMMUNE_RE.search(t):
        return "immune"
    if UI_STEPS_RE.search(t):
        return "ui_steps"
    return "rag"

# ——— 7) Main loop ————————————————————————————————————
if __name__ == "__main__":
    history: list[dict] = []
    print("🔎 igSCREEN assistant (type 'exit').")
    while True:
        q = input("You: ").strip()
        if not q or q.lower().startswith("exit"):
            print("Goodbye!")
            break

        history.append({"role": "user", "content": q})

        # 1) Lexical‐first gene redirect
        gene = ensure_best_gene(q)
        if gene:
            reply = (
                f"Redirecting you to the gene portal for {gene}:\n"
                f"https://igscreen.wenglab.org/gene/{gene}"
            )
            print("Bot:", reply)
            history.append({"role": "assistant", "content": reply})
            continue

        # 2) Regex buckets
        intent = classify_simple(q)
        if intent == "greeting":
            msgs = [{"role":"system","content":"You're a friendly assistant."}]
            msgs.extend(history[-20:])
            resp = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=msgs,
                temperature=0.7
            )
            reply = resp.choices[0].message.content.strip()
            print("Bot:", reply)
            history.append({"role":"assistant","content":reply})
            continue

        if intent == "phenotype":
            reply = "You can explore phenotypes here: https://igscreen.wenglab.org/phenotype"
            print("Bot:", reply)
            history.append({"role":"assistant","content":reply})
            continue

        if intent == "immune":
            reply = "You can explore immune cCRE activity here: https://igscreen.wenglab.org/lineage"
            print("Bot:", reply)
            history.append({"role":"assistant","content":reply})
            continue

        if intent == "ui_steps":
            reply = ui_help_steps(q)
            print("Bot:", reply)
            history.append({"role":"assistant","content":reply})
            continue

        # 3) Everything else → RAG fallback
        reply = rag_respond(q)
        print("Bot:", reply)
        history.append({"role":"assistant","content":reply})

    print("Session ended.")

