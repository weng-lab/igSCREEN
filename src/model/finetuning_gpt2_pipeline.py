import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel
import openai
import os
import re
from dotenv import load_dotenv

load_dotenv()
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

while True:
    user_input = input("\nEnter your question: ").strip()
    if user_input.lower() == "exit":
        print("Exiting.")
        break

    prompt = user_input + " => "
    tokens = tokenizer(
        prompt,
        return_tensors="pt",
        padding=True,
        truncation=True,
        max_length=512
    )
    inputs = {k: v.to(device) for k,v in tokens.items()}

    with torch.no_grad():
        output_ids = model.generate(
            input_ids=inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
            max_new_tokens=50,
            pad_token_id=tokenizer.eos_token_id,
            eos_token_id=tokenizer.eos_token_id,
            do_sample=False
        )

    full_output = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    if full_output.startswith(prompt):
        full_output = full_output[len(prompt):].strip()

    m = re.search(r"https?://\S+", full_output)
    if m:
        answer = m.group(0)
        print(f"\nAssistant:\n{answer}")
    else:
        print("\nFine-tuned model could not generate a useful response.")
        fallback = call_openai_fallback(user_input)
        print("\nAssistant (OpenAI fallback):")
        print(fallback)
