import re

UI_HELP_LISTS = [
    re.compile(r"\bwhat can i do\b", re.IGNORECASE),
    re.compile(r"\bhow do i\b", re.IGNORECASE),
    re.compile(r"\bwhere (can|do) I (find|look|locate|see)\b", re.IGNORECASE),
    re.compile(r"\bcan you help\b", re.IGNORECASE),
    re.compile(r"\bsearch\b", re.IGNORECASE),
    re.compile(r"\bportal\b", re.IGNORECASE),
    re.compile(r"\b(gene portal|icre portal|variant portal|phenotype|immune)\b", re.IGNORECASE),
]

GENOME_LOOKUPS_LISTS=[
    re.compile(r"\b(genome|variant|gene|sequence)\b", re.IGNORECASE),
    re.compile(r"\b[A-Z]{1,5}\d{1,7}\b", re.IGNORECASE),
]

class QueryClassifier:

    def __init__(self):
        self.q = ""

    def classify_query(self, query):
        self.q = query.strip().lower()

        for item in UI_HELP_LISTS:
            if item.search(self.q):
                return {"intent": "ui_help", "confidence":0.9 }
        
        for item in GENOME_LOOKUPS_LISTS:
            if item.search(self.q):
                return {"intent": "genome_help", "confidence": 0.9}
    
        return {"intent": "unknown", "confidence":0.4}