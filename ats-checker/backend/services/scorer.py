"""
services/scorer.py
Master scoring engine — combines all signals into final ATS score.

Score Weights:
  keyword_match       40%
  section_complete    20%
  format_compat       20%
  keyword_density     10%
  action_verbs        10%
"""

from typing import Dict, List, Tuple


WEIGHTS = {
    "keyword_match": 0.40,
    "section_completeness": 0.20,
    "format_compatibility": 0.20,
    "keyword_density": 0.10,
    "action_verbs": 0.10,
}


def compute_section_score(sections: List[Dict]) -> float:
    """
    Score based on how many required sections are present.
    Summary + Experience + Education + Skills are mandatory (heavy weight).
    Others are bonus.
    """
    mandatory = {"Summary", "Experience", "Education", "Skills"}
    bonus = {"Projects", "Certifications", "Achievements"}

    mandatory_found = sum(
        1 for s in sections
        if s["name"] in mandatory and s["found"]
    )
    bonus_found = sum(
        1 for s in sections
        if s["name"] in bonus and s["found"]
    )

    # Mandatory sections = 80% of section score
    mandatory_score = (mandatory_found / len(mandatory)) * 80
    # Bonus = up to 20%
    bonus_score = min(bonus_found * 7, 20)

    return round(mandatory_score + bonus_score, 2)


def compute_final_score(
    keyword_match: float,
    sections: List[Dict],
    format_score: float,
    keyword_density: float,
    action_verbs: float,
) -> Tuple[float, Dict]:
    """
    Compute weighted final ATS score.
    Returns (overall_score, breakdown_dict)
    """
    section_score = compute_section_score(sections)

    breakdown = {
        "keyword_match": round(keyword_match, 2),
        "section_completeness": round(section_score, 2),
        "format_compatibility": round(format_score, 2),
        "keyword_density": round(keyword_density, 2),
        "action_verbs": round(action_verbs, 2),
    }

    overall = (
        keyword_match       * WEIGHTS["keyword_match"] +
        section_score       * WEIGHTS["section_completeness"] +
        format_score        * WEIGHTS["format_compatibility"] +
        keyword_density     * WEIGHTS["keyword_density"] +
        action_verbs        * WEIGHTS["action_verbs"]
    )

    return round(overall, 2), breakdown


def get_score_label(score: float) -> str:
    if score >= 80:
        return "Excellent"
    elif score >= 60:
        return "Good"
    elif score >= 40:
        return "Fair"
    else:
        return "Poor"