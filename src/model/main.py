from queryclassifier import QueryClassifier
from model import Fallback_Model
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import os
import re
import psycopg2
from psycopg2 import sql, OperationalError
from dotenv import load_dotenv

load_dotenv()

ID_REGEX = re.compile(r"\b([A-Za-z0-9]+(?:[-\.][A-Za-z0-9]+)*)\b")
LINK_REGEX = re.compile(r"\b(Gene Portal|iCRE Portal|Variant Portal|Phenotype|Immune)\b", re.IGNORECASE)

def get_connection():
    return psycopg2.connect(
        host = os.getenv("DB_HOST"),
        port = os.getenv("DB_PORT"),
        user = os.getenv("DB_USER"),
        password = os.getenv("DB_PASS"),
        dbname = os.getenv("DB_NAME"),
    )

def extract_gene_id(gene):
    m = ID_REGEX.search(gene)
    return m.group(1).upper() if m else None

def extract_link_name(text, all_known):
    m = LINK_REGEX.search(text)
    if not m:
        return None

    found = m.group(1)
    for key in all_known:
        if key.lower() == found.lower():
            return key
    return None

def load_genome():
    #Returns all list of genome ids from database
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                sql.SQL("SELECT {col} FROM {schema}.{tbl};").format(
                    col = sql.Identifier("name"),
                    schema = sql.Identifier("gencode_02_29_2024"),
                    tbl = sql.Identifier("gene_grch38_29"),
                )
            )
            return [row[0] for row in cur.fetchall()]
    finally:
        conn.close()

def fetch_genome(genome_id):
    #Fetch genome data with matching genome ids
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                sql.SQL("""
                  SELECT {col}, {col2}
                    FROM {schema}.{tbl}
                   WHERE {col} = %s
                """).format(
                    col = sql.Identifier("name"),
                    col2 = sql.Identifier("gene_type"),
                    schema = sql.Identifier("gencode_02_29_2024"),
                    tbl = sql.Identifier("gene_grch38_29"),
                ),
                (genome_id,)
            )
            row = cur.fetchone()
            if not row:
                return None
            return {"name": row[0], "description": row[1]}
    finally:
        conn.close()

def load_link():
    #Returns all list of links user can be redirected
    return ["Gene Portal", "iCRE Portal", "Variant Portal", "Phenotype", "Immune"]

def fetch_link(link):
    dummy_db = {
        "Gene Portal": {"name": "Gene Portal", 
                        "description": "Explore gene expression across immune cell types at bulk and single-cell resolution for 43 cell types across 312 experiments.",
                        "link": "https://igscreen.wenglab.org/gene"},
        "iCRE Portal": {"name": "iCRE Portal",
                        "description": "Explore regulatory element activity (immune cCREs) across immune cell types at bulk and single-cell resolution for 63 cell types across 736 experiments.",
                        "link": "https://igscreen.wenglab.org/icre"},
        "Variant Portal": {"name": "Variant Portal",
                           "description": "Search variants of interest and explore their impact on gene expression, chromatin accessibility, and other molecular traits in immune cells.",
                           "link": "https://igscreen.wenglab.org/variant"},
        "Phenotype": {"name": "Phenotype Heritability Enrichment",
                      "description": "Select between 400 phenotypes to explore heritability enrichment (calculated by LD score regression) within 736 immune cell experiments.",
                      "link": "https://igscreen.wenglab.org/phenotype"},
        "Immune": {"name": "Immune cCRE Activity by Cell Type",
                   "description": "Compare immune cCRE activity between immune cell types.",
                   "link": "https://igscreen.wenglab.org/lineage"}
    }
    return dummy_db.get(link)

def llm_assist(query):
    #Can add LLM assist here
    return f"Sorry, we could not process your request {query}. Please contact our support below."

def provide_gene_links(gene_id, all_portals):
    print(f"Assistant: Here are links you can use for {gene_id}:")
    for portal in all_portals:
        rec = fetch_link(portal)
        if rec and "link" in rec:
            # rec["link"] is the base URL; append "/" + gene_id
            print(f"{portal}: {rec['link']}/{gene_id}")
        else:
            print(f"{portal}: (no base URL available)")
        


def main():
    qc = QueryClassifier()
    fm = Fallback_Model(
        biobert_model_name="pritamdeka/BioBERT-mnli-snli-scinli-scitail-mednli-stsb",
        device=None,
        lexical_threshold=0.80,
        semantic_threshold=0.75,
        sequence_threshold=0.80
    )
    # 1) load all the genes from database
    all_genome_ids = load_genome()
    all_link = load_link()

    print("Assistant: Hi! How can I assist you today?")
    while True:
        user_input = input("User: ").strip()
        if not user_input:
            continue
        if user_input.lower().startswith(("exit", "thanks", "bye")):
            break

        query = qc.classify_query(user_input)
        intent = query.get("intent")
        confidence = query.get("confidence", 0.0)

        portal = extract_link_name(user_input, all_link)
        if portal:
            link_record = fetch_link(portal)
            if link_record:
                print(f"Assistant: Here's the {portal}")
                print(f"    Description: {link_record['description']}")
                print(f"    URL: {link_record['link']}")
            else:
                print(f"Assistant: Hm, I know about {portal}, but I can't retrieve the link right now.")
            continue

        if intent == "ui_help" and confidence >= 0.8:
            #process website redirection
            portal = extract_link_name(user_input, all_link)
            if portal:
                link_record = fetch_link(portal)
                if link_record:
                    print(f"Assistant: Here's the {portal}:")
                    print(f"    Description: {link_record['description']}")
                    print(f"    URL: {link_record['link']}")
                else:
                    print(f"Assistant: Hm, I know about {portal}, but I can't retrieve the link right now.")
            else:
                print("Assistant: To browse genomes, click 'Search' → enter the gene ID → hit 'Go'.")
                print("If you want to explore portals, you can say things like “Show me the Gene Portal” or “Take me to the iCRE Portal.”")
            continue
        
        elif intent == "genome_help" and confidence >= 0.8:
            #Exact match with the genome existing in the database
            gene_id = extract_gene_id(user_input)
            if gene_id is None:
                print("Assistant: I saw “genome” in your question but couldn't find a valid ID. Try something like “BRCA1” or “TP53”.")
                continue
            record = fetch_genome(gene_id.upper())
            if record:
                print(f"Assistant: Found exact match for '{gene_id.upper()}':")
                print(f"   Name: {record['name']}")
                print(f"   Description: {record['description']}")

                choice = input(f"Assistant: Would you like portal links for '{gene_id.upper()}'? (yes/no) ").strip().lower()
                if choice.startswith("y"):
                    provide_gene_links(gene_id.upper(), all_link)
                continue

            #If no exact match exists
            best = fm.find_best_match(query=gene_id.upper(), candidates=all_genome_ids, query_sequence=None, db_path="", k=5)
            mode = best["mode"]
            match = best["match"]
            score = best["score"]
            topk = best["topk"]

            if mode == "lexical":
                # Present top-K lexical suggestions
                print(f"Assistant: I didn't find '{gene_id.upper()}', but here are the top 5 lexical matches:")
                for idx, (cand, sc) in enumerate(topk["lexical"], start=1):
                    print(f"  {idx}. {cand}  (score {sc:.2f})")
                choice = input("Assistant: Which of these did you mean? Type the number or 'none': ").strip().lower()
                if choice.isdigit():
                    idx = int(choice) - 1
                    if 0 <= idx < len(topk["lexical"]):
                        chosen = topk["lexical"][idx][0]
                        rec = fetch_genome(chosen)
                        if rec:
                            print(f"Assistant: Here is the record for '{chosen}':")
                            print(f"    Name: {rec['name']}")
                            print(f"    Description: {rec['description']}")
                            sub_choice = input(f"Assistant: Would you like portal links for '{chosen}'? (yes/no) ").strip().lower()
                            if sub_choice.startswith("y"):
                                provide_gene_links(chosen, all_link)
                        else:
                            print(f"Assistant: Odd—'{chosen}' exists but I can't fetch details right now.")
                    else:
                        print("Assistant: Invalid selection. Try again if you'd like.")
                else:
                    print("Assistant: No problem—let me know if you'd like something else.")
                continue

            elif mode == "semantic":
                print(f"Assistant: I did not find '{gene_id.upper()}', but here are the top 5 semantic matches:")
                for idx, (cand, sc) in enumerate(topk["semantic"], start=1):
                    print(f"  {idx}. {cand}  (score {sc:.2f})")
                choice = input("Assistant: Which of these did you mean? Type the number or 'none': ").strip().lower()
                if choice.isdigit():
                    idx = int(choice) - 1
                    if 0 <= idx < len(topk["semantic"]):
                        chosen = topk["semantic"][idx][0]
                        rec = fetch_genome(chosen)
                        if rec:
                            print(f"Assistant: Here is the record for '{chosen}':")
                            print(f"    Name: {rec['name']}")
                            print(f"    Description: {rec['description']}")
                            sub_choice = input(f"Assistant: Would you like portal links for '{chosen}'? (yes/no) ").strip().lower()
                            if sub_choice.startswith("y"):
                                provide_gene_links(chosen, all_link)
                        else:
                            print(f"Assistant: Odd—'{chosen}' exists but I can't fetch details right now.")
                    else:
                        print("Assistant: Invalid selection.")
                else:
                    print("Assistant: No problem—let me know if you'd like something else.")
                continue

            elif mode == "sequence":
                print(f"Assistant: I found these sequence matches (percent identity):")
                for idx, (subj_id, sc) in enumerate(topk["sequence"], start=1):
                    print(f"  {idx}. {subj_id}  (identity {sc:.2f})")
                choice = input("Assistant: Which of these did you mean? Type the number or 'none': ").strip().lower()
                if choice.isdigit():
                    idx = int(choice) - 1
                    if 0 <= idx < len(topk["sequence"]):
                        chosen = topk["sequence"][idx][0]
                        rec = fetch_genome(chosen)
                        if rec:
                            print(f"Assistant: Here is the record for '{chosen}':")
                            print(f"  Name: {rec['name']}")
                            print(f"  Description: {rec['description']}")
                            sub_choice = input(f"Assistant: Would you like portal links for '{chosen}'? (yes/no) ").strip().lower()
                            if sub_choice.startswith("y"):
                                provide_gene_links(chosen, all_link)
                        else:
                            print(f"Assistant: Odd—'{chosen}' exists but I can't fetch details right now.")
                    else:
                        print("Assistant: Invalid selection.")
                else:
                    print("Assistant: No problem—let me know if you'd like something else.")
                continue

            else:  # mode == "none"
                print(f"Assistant: Sorry, I could not find anything close to '{gene_id.upper()}'.")
                print("Assistant: Please check your spelling or try a different gene ID. If you need help, contact support.")
                continue

        else:
            llm_answer = llm_assist(user_input)
            print(f"Assistant: {llm_answer}")
            continue

if __name__ == "__main__":
    main()
