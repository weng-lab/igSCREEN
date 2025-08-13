import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel
import re, os, pickle, faiss, openai, numpy as np, difflib
from dotenv import load_dotenv

gene_index = faiss.read_index("gene_meta_index.faiss")
with open("gene_docs.pkl","rb") as f: gene_docs = pickle.load(f)
ccre_index = faiss.read_index("ccre_meta_index.faiss")
with open("ccre_docs.pkl","rb") as f: ccre_docs = pickle.load(f)

load_dotenv()
ID_REGEX = re.compile(r"\b[A-Za-z][A-Za-z0-9\.-]*\b")
ACCESSION_REGEX = re.compile(r"\b(EH\d+E\d+)\b", re.I)
openai.api_key = os.getenv("OPENAI_API_KEY")

MODEL_DIR = "gpt2-igscreen"
tokenizer = GPT2Tokenizer.from_pretrained(MODEL_DIR)
model = GPT2LMHeadModel.from_pretrained(MODEL_DIR, use_safetensors=True)
model.eval()
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

print("GPT-2 Prompt Generator Ready (type 'exit' to quit)")

LINEAGE_TERMS = ["hematopoetic", "atac", "dnase", "progenitor", "erythroblast", "plasmacytoid", "myeloid",
                    "monocyte", "macrophage", "natural killer", "double negative", "immature", "mature", "memory",
                    "effector", "regulatory", "helper", "plasmablast", "b cell", "cd8", "t cell", "double positive", 
                    "stem cell", "gamma delta t"]

PLOT_TERMS = ["plot", "graph", "upset"]

def ensure_lineage(raw: str) -> bool:
    text = raw.lower()

    has_plot_term = any(term in text for term in PLOT_TERMS)

    has_lineage_term = any(term in text for term in LINEAGE_TERMS)

    return has_plot_term and has_lineage_term



def rag_accession(accession: str) -> str:
    url =f"https://igscreen.wenglab.org/icre/{accession}"
    return(
        f" cCRE annotation for {accession}: \n"
        f"{url}\n"
        "You can further filter by Biosample, Stimulation, and other columns; "
        "Explore what genes and variants are associated from the tabs on the left"
    )

def rag_lineage() -> str:
    url = "https://igscreen.wenglab.org/lineage"
    return(
        "Explore the UpSet plot comparing iCRE activity \n"
        f"{url}\n"
        "Use the filters to select between 2 to 6 cells to compare."
        "You will also be able to see different active iCRE depending on the filters"
    )

VALID_ACCESSIONS = {doc["id"].upper() for doc in ccre_docs}

def ensure_accession(raw: str) -> str | None:
    for tok in re.findall(ACCESSION_REGEX, raw):
        up = tok.upper()
        if up in VALID_ACCESSIONS:
            return up
        # 2) Optional fuzzy:
        matches = difflib.get_close_matches(up, VALID_ACCESSIONS, n=1, cutoff=0.8)
        if matches: return matches[0]
    return None

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
        user_input = re.sub(
            rf"\b{re.escape(orig_tok)}\b",
            gene,
            user_input,
            flags=re.IGNORECASE
        )
    acc = ensure_accession(user_input)
    if acc:
        answer = rag_accession(acc)
        print("\nAssistant:\n" + answer)

    elif ensure_lineage(user_input):
        answer = rag_lineage()
        print("\nAssistant:\n" + answer)
    else:
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
            answer = m.group(0)
            print("\nAssistant:\n" + answer)
        else:
            print("\nFine-tuned model could not generate a useful response.")
            print("\nAssistant (OpenAI fallback):")
            answer = call_openai_fallback(user_input)
            print(answer)