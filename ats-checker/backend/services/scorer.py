"""
services/scorer.py
Experience-level-aware scoring engine.

Default weights:
  keyword_match       40%
  section_complete    20%
  format_compat       20%
  keyword_density     10%
  action_verbs        10%

Freshers get more weight on sections/format (less keyword history).
Senior/executive get more weight on keyword match (they should tailor heavily).
"""

from typing import Dict, List, Tuple

# Weights per experience level
WEIGHT_PROFILES = {
    "fresher": {
        "keyword_match":       0.30,
        "section_completeness":0.25,
        "format_compatibility":0.25,
        "keyword_density":     0.10,
        "action_verbs":        0.10,
    },
    "mid": {
        "keyword_match":       0.40,
        "section_completeness":0.20,
        "format_compatibility":0.20,
        "keyword_density":     0.10,
        "action_verbs":        0.10,
    },
    "senior": {
        "keyword_match":       0.45,
        "section_completeness":0.15,
        "format_compatibility":0.20,
        "keyword_density":     0.10,
        "action_verbs":        0.10,
    },
    "executive": {
        "keyword_match":       0.45,
        "section_completeness":0.15,
        "format_compatibility":0.20,
        "keyword_density":     0.08,
        "action_verbs":        0.12,
    },
}


def compute_section_score(sections: List[Dict]) -> float:
    mandatory = {"Summary", "Experience", "Education", "Skills"}
    bonus     = {"Projects", "Certifications", "Achievements"}

    mandatory_found = sum(1 for s in sections if s["name"] in mandatory and s["found"])
    bonus_found     = sum(1 for s in sections if s["name"] in bonus     and s["found"])

    mandatory_score = (mandatory_found / len(mandatory)) * 80
    bonus_score     = min(bonus_found * 7, 20)
    return round(mandatory_score + bonus_score, 2)


def compute_final_score(
    keyword_match: float,
    sections: List[Dict],
    format_score: float,
    keyword_density: float,
    action_verbs: float,
    experience_level: str = "mid",
) -> Tuple[float, Dict]:
    weights = WEIGHT_PROFILES.get(experience_level, WEIGHT_PROFILES["mid"])
    section_score = compute_section_score(sections)

    breakdown = {
        "keyword_match":       round(keyword_match,   2),
        "section_completeness":round(section_score,   2),
        "format_compatibility":round(format_score,    2),
        "keyword_density":     round(keyword_density, 2),
        "action_verbs":        round(action_verbs,    2),
    }

    overall = (
        keyword_match  * weights["keyword_match"]        +
        section_score  * weights["section_completeness"] +
        format_score   * weights["format_compatibility"] +
        keyword_density* weights["keyword_density"]      +
        action_verbs   * weights["action_verbs"]
    )

    return round(overall, 2), breakdown


def get_score_label(score: float) -> str:
    if score >= 80: return "Excellent"
    if score >= 60: return "Good"
    if score >= 40: return "Fair"
    return "Poor"
