"""Tool to retrieve exact verbatim provisions from the RTI Act 2005 corpus."""
import json
from pathlib import Path
from typing import List, Dict, Any, Optional

try:
    from strands import tool
except ImportError:
    try:
        from strands_agents import tool
    except ImportError:
        def tool(func):
            return func

CORPUS_PATH = Path(__file__).parent.parent / "corpus" / "rti_act_2005.json"


def _load_act():
    if CORPUS_PATH.exists():
        with open(CORPUS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


@tool
def lookup_rti_provision(query: str, section: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve verbatim sections and subsections from the official Right to Information Act 2005 corpus.

    Args:
        query: Search keywords or topic (e.g. '30 days deadline', 'fee exemption BPL', 'reasons required', 'exemptions').
        section: Optional specific section number to retrieve (e.g., '6', '7', '8', '19', '24').

    Returns:
        List of matching clause dicts containing 'id', 'section', 'sub', 'title', 'text', and 'source_url'.
    """
    clauses = _load_act()
    results = []

    clean_sec = section.strip().lower() if section else None

    if clean_sec:
        for item in clauses:
            if item.get("section", "").lower() == clean_sec or item.get("id", "").lower() == f"s{clean_sec}":
                results.append(item)
        return results

    if not results:
        query_words = set(query.lower().split())
        scored_items = []
        for item in clauses:
            searchable_text = f"{item.get('title', '')} {item.get('text', '')} section {item.get('section', '')}".lower()
            score = 0
            for word in query_words:
                if len(word) > 2 and word in searchable_text:
                    score += 1
            if score > 0:
                scored_items.append((score, item))
        
        scored_items.sort(key=lambda x: x[0], reverse=True)
        results = [item for _, item in scored_items[:5]]

    if not results and clauses:
        # Fallback: return default core sections (Section 6(1), Section 7(1))
        results = [item for item in clauses if item.get("id") in ["s6-1", "s7-1", "s6-2"]]

    return results
