# hosted_finetune.py

import os, csv, json, time
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

CSV_FILE   = "finetune_dataset.csv"
JSONL_FILE = "train.jsonl"
STATE_FILE = "ft_state.json"

BASE_MODEL = "gpt-3.5-turbo"
EPOCHS     = 4
BATCH_SIZE = 16
LR         = None

def load_state():
    return json.load(open(STATE_FILE)) if os.path.exists(STATE_FILE) else {}

def save_state(s):
    json.dump(s, open(STATE_FILE, "w"), indent=2)

def build_jsonl():
    if os.path.exists(JSONL_FILE):
        os.remove(JSONL_FILE)
    print("→ rebuilding", JSONL_FILE)
    with open(CSV_FILE, encoding="latin1", errors="ignore") as cf, \
         open(JSONL_FILE, "w", encoding="utf-8") as out:
        reader = csv.DictReader(cf)
        for row in reader:
            link = (row.get("igscreen_link_gene") or "").strip() \
                or (row.get("igscreen_link_region") or "").strip()
            if not link: 
                continue
            prompt = row["prompt"].strip()
            out.write(json.dumps({
                "prompt":     prompt,
                "completion": " " + link
            }) + "\n")

def upload_file(st):
    if "file_id" in st:
        return st["file_id"]
    resp = client.files.create(file=open(JSONL_FILE, "rb"), purpose="fine-tune")
    st["file_id"] = resp.id; save_state(st)
    return resp.id

def create_job(st):
    if "fine_tune_id" in st:
        return st["fine_tune_id"]
    resp = client.fine_tuning.jobs.create(
        training_file=st["file_id"],
        model=BASE_MODEL,
        hyperparameters={
            "n_epochs": EPOCHS,
            **({"batch_size": BATCH_SIZE} if BATCH_SIZE is not None else {}),
            **({"learning_rate_multiplier": LR} if LR is not None else {}),
        },
    )
    st["fine_tune_id"] = resp.id; save_state(st)
    return resp.id

def wait_for_completion(st):
    jid = st["fine_tune_id"]
    print("→ monitoring", jid)
    while True:
        info = client.fine_tuning.jobs.retrieve(jid)
        print("  status:", info.status)

        # iterate the events stream directly
        for e in client.fine_tuning.jobs.list_events(jid):
            ts = time.strftime("%H:%M:%S", time.localtime(e.created_at))
            print(f"    {ts} [{e.level}] {e.message}")

        if info.status in ("succeeded", "failed"):
            break
        time.sleep(10)

def main():
    st = load_state()
    build_jsonl()
    upload_file(st)
    create_job(st)
    wait_for_completion(st)

if __name__=="__main__":
    main()
