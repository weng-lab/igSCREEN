import re
import openai
import faiss
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import os


# ——— 0) Few-shot examples for UI navigation ——————————————————
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

# ——— 1) Load RAG index + docs ——————————————————————————
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

index = faiss.read_index("gene_meta_index.faiss")
with open("gene_docs.pkl","rb") as f:
    gene_docs = pickle.load(f)

# ——— 2) Embedder & intent regexes ——————————————————————
embedder = SentenceTransformer("all-MiniLM-L6-v2")

GREETING_RE = re.compile(r"\b(hi|hello|how are you)\b", re.I)
PHENO_RE    = re.compile(r"\bphenotype", re.I)
IMMUNE_RE   = re.compile(r"\bimmune\b", re.I)
UI_STEPS_RE = re.compile(r"\b(how do i|how to|step-by-step|step by step|guide me)\b", re.I)

def classify(raw: str) -> str:
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

# ——— 3) RAG responder ————————————————————————————————
def rag_respond(q: str, k: int = 3) -> str:
    q_emb = embedder.encode(q, normalize_embeddings=True, convert_to_numpy=True).astype("float32")
    D,I = index.search(np.array([q_emb]), k)
    ctx = "\n".join(f"- {gene_docs[i]['text']}" for i in I[0])
    system = {"role":"system","content":"You are a friendly genome-portal assistant. Use the context to guide the user."}
    user   = {"role":"user",  "content":f"Context:\n{ctx}\n\nUser: {q}\nAssistant:"}
    resp = openai.ChatCompletion.create(
        model="gpt-4o", messages=[system,user], temperature=0.0
    )
    return resp.choices[0].message.content.strip()

# ——— 4) UI-help few-shot function ————————————————————————
def ui_help_steps(user_q: str) -> str:
    # try to extract the URL
    m = re.search(r"https?://\S+", user_q)
    if m:
        url = m.group(0)
        task = user_q.replace(url, "").strip()
    else:
        # if no URL, ask the user
        return "Sure—what page are you on (please paste the full URL)?"

    # build the few-shot messages
    msgs = [SYSTEM_UI]
    for ex in EXAMPLES:
        msgs.append({"role":"user",      "content": ex["user"]})
        msgs.append({"role":"assistant", "content": "\n".join(ex["assistant"])})
    # finally add the real user request
    msgs.append({"role":"user", "content": f"I'm on {url} and I want to {task}"})

    resp = openai.ChatCompletion.create(
        model="gpt-4o", messages=msgs, temperature=0.0
    )
    return resp.choices[0].message.content.strip()

# ——— 5) Chat loop ————————————————————————————————————
if __name__=="__main__":
    print("Type 'exit' to quit.")
    while True:
        q = input("You: ").strip()
        if not q or q.lower().startswith("exit"):
            break

        intent = classify(q)
        if intent=="greeting":
            # free-form chat
            chat = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[
                  {"role":"system","content":"You're a friendly assistant."},
                  {"role":"user","content":q}
                ],
                temperature=0.7
            )
            print("Bot:", chat.choices[0].message.content.strip())

        elif intent=="phenotype":
            print("Bot: You can explore phenotypes here: https://igscreen.wenglab.org/phenotype")

        elif intent=="immune":
            print("Bot: You can explore immune cCRE activity here: https://igscreen.wenglab.org/lineage")

        elif intent=="ui_steps":
            print("Bot:", ui_help_steps(q))

        else:
            print("Bot:", rag_respond(q))

    print("Done.")
