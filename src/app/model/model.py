from transformers import AutoModel, AutoTokenizer
from sentence_transformers import SentenceTransformer, util
import subprocess
import tempfile
import torch
import torch.nn.functional as F
from rapidfuzz import fuzz
import os

def mean_pooling(hidden_states: torch.Tensor, attention_mask = torch.Tensor):
    mask_expanded = attention_mask.unsqueeze(-1).expand(hidden_states.size()).float()
    sum_embeddings = torch.sum(hidden_states * mask_expanded, dim=1)
    token_counts = torch.clamp(mask_expanded.sum(dim=1), min=1e-9)
    return sum_embeddings / token_counts

class Fallback_Model():
    def __init__(self, biobert_model_name = "pritamdeka/BioBERT-mnli-snli-scinli-scitail-mednli-stsb", device = None, lexical_threshold = 0.9, semantic_threshold = 0.85, sequence_threshold = 0.9):
        self.lexical_threshold = lexical_threshold
        self.semantic_threshold = semantic_threshold
        self.sequence_threshold = sequence_threshold
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.embedder = SentenceTransformer(biobert_model_name, device=self.device)

    
    def lexical_scan(self, query, candidates, k=5):
        scores = []

        for cand in candidates:
            raw_score = fuzz.token_set_ratio(query, cand)
            normalized = raw_score / 100.0
            scores.append((cand, normalized))
        scores.sort(key=lambda x:x[1], reverse=True)
        return scores[:k]
    
    def semantic_scan(self, query, candidates, k=5):
        if not candidates:
            return []
        
        # Debug print to confirm we got here
        print(f"[DEBUG] semantic_scan called with query='{query}'")

        cand_embeddings = self.embedder.encode(
            candidates, 
            convert_to_tensor=True, 
            normalize_embeddings=True
        )
        # Print out the shape of candidate embeddings
        print(f"[DEBUG] cand_embeddings.shape = {cand_embeddings.shape}")

        q_embedding = self.embedder.encode(
            query, 
            convert_to_tensor=True,
            normalize_embeddings=True
        )
        print(f"[DEBUG] q_embedding.shape = {q_embedding.shape}")

        cos_scores = util.cos_sim(q_embedding, cand_embeddings).squeeze(0)
        topk_scores, topk_idx = torch.topk(cos_scores, k=min(k, len(candidates)))
        out = []
        for idx, score in zip(topk_idx.tolist(), topk_scores.tolist()):
            out.append(candidates[idx], float(score))
        return out
    
    def sequence_scan(self, query_sequence, db_path, k=5):
        with tempfile.NamedTemporaryFile(mode="w", delete=False) as tmp:
            tmp.write(">query_sequence\n")
            tmp.write(query_sequence + "\n")
            tmp_fasta = tmp.name
        
        blast_args=[
            "blastn",
            "-query", tmp_fasta,
            "-db", db_path,
            "-outfmt", "6 sseqid pident",
            "-max_target_seqs", "1",
            "-dust", "no",
        ]
        try:
            proc = subprocess.run(
                blast_args,
                capture_output=True,
                text=True,
                check=True,
            )
        except (subprocess.CalledProcessError, FileNotFoundError):
            os.unlink(tmp_fasta)
            return None, 0.0
        
        os.unlink(tmp_fasta)
        lines = proc.stdout.strip().splitlines()
        if not lines:
            return []
        out = []
        for line in lines:
            parts = line.split("\t")
            if len(parts) != 2:
                continue
            subj_id, pident_str = parts
            try:
                pident = float(pident_str) / 100.0
            except ValueError:
                pident = 0.0
            out.append((subj_id, pident))
        return out
    
    def get_topk_candidates(self, query, candidates, query_sequence, db_path="", k=5):
        lex_list = self.lexical_scan(query, candidates, k)
        sem_list = self.lexical_scan(query, candidates, k)
        seq_list = []
        if query_sequence is not None and db_path:
            seq_list = self.lexical_scan(query_sequence, db_path, k)

        return {
            "lexical": lex_list,
            "semantic": sem_list,
            "sequence": seq_list
        }
    
    def find_best_match(self, query, candidates, query_sequence = None, db_path = "", k=5):
                # Exact match
        if query in candidates:
            return {
                "mode": "exact",
                "match": query,
                "score": 1.0,
                "topk": {
                    "lexical":  [(query, 1.0)],
                    "semantic": [(query, 1.0)],
                    "sequence": []
                }
            }

        # Gather top-k lists
        topk_dict = self.get_topk_candidates(
            query=query,
            candidates=candidates,
            query_sequence=query_sequence,
            db_path=db_path,
            k=k
        )
        lex_list = topk_dict["lexical"]
        sem_list = topk_dict["semantic"]
        seq_list = topk_dict["sequence"]

        # (2) Lexical check
        if lex_list and lex_list[0][1] >= self.lexical_threshold:
            return {
                "mode": "lexical",
                "match": lex_list[0][0],
                "score": lex_list[0][1],
                "topk": topk_dict
            }

        # (3) Semantic check
        if sem_list and sem_list[0][1] >= self.semantic_threshold:
            return {
                "mode": "semantic",
                "match": sem_list[0][0],
                "score": sem_list[0][1],
                "topk": topk_dict
            }

        # (4) Sequence check (if provided)
        if query_sequence is not None and seq_list:
            if seq_list[0][1] >= self.sequence_threshold:
                return {
                    "mode": "sequence",
                    "match": seq_list[0][0],
                    "score": seq_list[0][1],
                    "topk": topk_dict
                }

        # (5) No match found
        return {
            "mode": "none",
            "match": None,
            "score": 0.0,
            "topk": topk_dict
        }