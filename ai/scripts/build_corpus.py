"""Helper script to validate and normalize RTI Act and Authorities corpus files."""
import json
from pathlib import Path

CORPUS_DIR = Path(__file__).parent.parent / "rtikit_ai" / "corpus"

def validate_corpus():
    act_file = CORPUS_DIR / "rti_act_2005.json"
    authorities_file = CORPUS_DIR / "authorities.json"

    assert act_file.exists(), f"Missing {act_file}"
    assert authorities_file.exists(), f"Missing {authorities_file}"

    with open(act_file, "r", encoding="utf-8") as f:
        act_data = json.load(f)
    
    with open(authorities_file, "r", encoding="utf-8") as f:
        auth_data = json.load(f)

    print(f"Loaded {len(act_data)} sections/subsections from RTI Act corpus.")
    print(f"Loaded {len(auth_data)} authority mapping entries.")

    for item in act_data:
        assert "id" in item and "section" in item and "text" in item, f"Invalid item: {item}"
        assert len(item["text"].strip()) > 0, f"Empty text in section {item['section']}"

    print("Corpus validation successful!")

if __name__ == "__main__":
    validate_corpus()
