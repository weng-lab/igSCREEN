import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel
import re, os, pickle, faiss, openai, numpy as np, difflib
from dotenv import load_dotenv

gene_index = faiss.read_index("gene_meta_index.faiss")
with open("gene_docs.pkl","rb") as f: gene_docs = pickle.load(f)

load_dotenv()
ID_REGEX = re.compile(r"\b[A-Za-z][A-Za-z0-9\.-]*\b")
openai.api_key = os.getenv("OPENAI_API_KEY")

MODEL_DIR = "gpt2-igscreen"
tokenizer = GPT2Tokenizer.from_pretrained(MODEL_DIR)
model = GPT2LMHeadModel.from_pretrained(MODEL_DIR, use_safetensors=True)
model.eval()
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

print("GPT-2 Prompt Generator Ready (type 'exit' to quit)")

def call_openai_fallback(prompt):
    fallback_prompt = (
        "You are a bioinformatics helper trying to provide redirection. "
        f"Try to answer your best from:\n'{prompt}'"
    )
    try:
        resp = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role":"user","content":fallback_prompt}],
            temperature=0.0
        )
        return resp.choices[0].message.content.strip()
    except Exception as e:
        return f"(OpenAI fallback failed: {e})"

VALID_GENES = {doc["id"].upper() for doc in gene_docs}

def normalize_gene(q: str) -> tuple[str,str] | None:
    # 1) exact token
    for tok in re.findall(ID_REGEX, q):
        up = tok.upper()
        if up in VALID_GENES:
            return tok, up

    # 2) fuzzy
    for tok in re.findall(ID_REGEX, q):
        up = tok.upper()
        matches = difflib.get_close_matches(up, VALID_GENES, n=1, cutoff=0.8)
        if matches:
            return tok, matches[0]

    return None

while True:
    user_input = input("\nEnter your question: ").strip()
    if user_input.lower() == "exit":
        break

    # Normalize gene before generation
    norm = normalize_gene(user_input)
    if norm:
        orig_tok, gene = norm
        # replace *that exact* orig_tok with its uppercase canonical form
        user_input = re.sub(
            rf"\b{re.escape(orig_tok)}\b",
            gene,
            user_input,
            flags=re.IGNORECASE
        )

    # Now build your prompt and generate as usual
    prompt = user_input + " => "
    tokens = tokenizer(
        prompt, return_tensors="pt",
        padding=True, truncation=True, max_length=512
    )
    inputs = {k: v.to(device) for k, v in tokens.items()}
    with torch.no_grad():
        output_ids = model.generate(
            **inputs,
            max_new_tokens=50,
            pad_token_id=tokenizer.eos_token_id,
            eos_token_id=tokenizer.eos_token_id,
            do_sample=False
        )
    full_output = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    if full_output.startswith(prompt):
        full_output = full_output[len(prompt):].strip()

    # extract the URL
    m = re.search(r"https?://\S+", full_output)
    if m:
        print("\nAssistant:\n" + m.group(0))
    else:
        print("\nFine-tuned model could not generate a useful response.")
        print("\nAssistant (OpenAI fallback):")
        print(call_openai_fallback(user_input))