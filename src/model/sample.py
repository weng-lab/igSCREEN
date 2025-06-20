from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# 1) Specify the BioBERT NLI checkpoint
MODEL_NAME = "pritamdeka/BioBERT-mnli-snli-scinli-scitail-mednli-stsb"

# 2) Load tokenizer & model
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, use_fast=True)
model     = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

# 3) Inspect how many labels the head has
id2label   = model.config.id2label
num_labels = model.config.num_labels
print("Label mapping:", id2label)
print("Num labels:", num_labels)

# 4) For a 2-label head (as here), assume index 1 is "entailment"
entail_idx = 1

# 5) Define a helper to get the entailment probability
def semantic_score(a: str, b: str) -> float:
    inputs = tokenizer(
        a,
        b,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512,
    )
    logits = model(**inputs).logits       # shape (1, 2)
    probs  = torch.softmax(logits, dim=1)[0]
    return probs[entail_idx].item()

# 6) Quick sanity check
if __name__ == "__main__":
    pairs = [
        ("BRCA1",   "BRC1"),
        ("TP53",    "EGFR"),
        ("BRCA2",   "BRCA2"),
    ]
    for a, b in pairs:
        score = semantic_score(a, b)
        print(f"Entailment({a!r}, {b!r}) = {score:.3f}")
