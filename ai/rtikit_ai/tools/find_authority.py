"""Tool to find the appropriate public authority and department for an RTI topic."""
import json
from pathlib import Path
from typing import Dict, Any

try:
    from strands import tool
except ImportError:
    try:
        from strands_agents import tool
    except ImportError:
        def tool(func):
            return func

CORPUS_PATH = Path(__file__).parent.parent / "corpus" / "authorities.json"


def _load_authorities():
    if CORPUS_PATH.exists():
        with open(CORPUS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


@tool
def find_authority(topic_description: str) -> Dict[str, Any]:
    """Search for the target Public Authority and department for a given topic or problem description.

    Args:
        topic_description: A plain language description of the topic, problem, or department involved.

    Returns:
        A dictionary with 'authority_type', 'typical_department', 'confidence', 'reasoning', and 'notes'.
    """
    authorities = _load_authorities()
    query_lower = topic_description.lower()
    query_words = set(query_lower.split())

    best_match = None
    max_score = 0

    for entry in authorities:
        score = 0
        topics = entry.get("topics", [])
        for topic in topics:
            if topic in query_lower:
                score += 3
            else:
                for word in topic.split():
                    if word in query_words and len(word) > 2:
                        score += 1
        
        if score > max_score:
            max_score = score
            best_match = entry

    if best_match and max_score >= 3:
        confidence = "high" if max_score >= 5 else "medium"
        return {
            "authority_type": best_match["authority_type"],
            "typical_department": best_match["typical_department"],
            "confidence": confidence,
            "reasoning": f"Matched topic keywords in user query with score {max_score}.",
            "notes": best_match.get("notes", "")
        }
    elif best_match and max_score > 0:
        return {
            "authority_type": best_match["authority_type"],
            "typical_department": best_match["typical_department"],
            "confidence": "low",
            "reasoning": "Partial keyword match found, but specific jurisdiction or department should be verified.",
            "notes": best_match.get("notes", "")
        }
    else:
        return {
            "authority_type": "General Public Information Officer / District Magistrate Office",
            "typical_department": "RTI & Public Grievance Cell",
            "confidence": "low",
            "reasoning": "Unsure about specific department from query keywords. Recommending general district RTI cell or PIO of concerned Ministry.",
            "notes": "Please specify your state/city or exact department to get a precise PIO designation."
        }
