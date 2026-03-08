"""
services/nlp_engine.py
Core NLP processing:
- Keyword extraction from JD and Resume
- Named entity recognition
- Section detection
- Action verb analysis
"""

import re
from typing import List, Dict, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


# ─── Section Keywords ──────────────────────────────────────────────────────────

SECTION_PATTERNS = {
    "summary": [
        r"\b(summary|objective|profile|about me|professional summary|career objective|overview)\b"
    ],
    "experience": [
        r"\b(experience|work experience|employment|work history|professional experience|career history)\b"
    ],
    "education": [
        r"\b(education|academic|qualification|degree|university|college|school)\b"
    ],
    "skills": [
        r"\b(skills|technical skills|core competencies|expertise|technologies|proficiencies)\b"
    ],
    "projects": [
        r"\b(projects|personal projects|academic projects|portfolio|case studies)\b"
    ],
    "certifications": [
        r"\b(certifications|certificates|licenses|accreditations|credentials)\b"
    ],
    "achievements": [
        r"\b(achievements|awards|honors|accomplishments|recognition)\b"
    ],
}

# ─── Action Verbs ──────────────────────────────────────────────────────────────

STRONG_ACTION_VERBS = {
    "led", "built", "designed", "developed", "implemented", "architected",
    "optimized", "reduced", "increased", "managed", "created", "launched",
    "deployed", "automated", "improved", "delivered", "achieved", "spearheaded",
    "engineered", "established", "accelerated", "collaborated", "mentored",
    "streamlined", "transformed", "integrated", "analyzed", "resolved",
    "generated", "coordinated", "executed", "migrated", "scaled", "shipped",
}

WEAK_VERBS = {
    "helped", "assisted", "tried", "worked on", "participated", "involved",
    "responsible for", "duties included", "tasked with",
}

# ─── Stop words to exclude from keyword matching ──────────────────────────────

CUSTOM_STOP_WORDS = [
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "shall", "can", "need", "must",
    "we", "you", "i", "he", "she", "they", "it", "this", "that", "these",
    "those", "our", "your", "their", "its", "us", "him", "her", "them",
    "also", "just", "very", "so", "as", "if", "about", "more", "other",
    "than", "then", "when", "where", "how", "all", "any", "each", "both",
    "few", "some", "such", "no", "not", "only", "same", "own", "into",
    "through", "during", "before", "after", "above", "below", "between",
]


def extract_keywords_tfidf(text: str, top_n: int = 30) -> List[Tuple[str, float]]:
    """
    Extract top keywords using TF-IDF from a single document.
    Returns list of (keyword, score) tuples.
    """
    # Split into sentences to treat as mini-docs for TF-IDF
    sentences = re.split(r'[.\n!?]', text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 10]

    if len(sentences) < 2:
        sentences = [text, text]  # fallback

    try:
        vectorizer = TfidfVectorizer(
            stop_words=CUSTOM_STOP_WORDS,
            ngram_range=(1, 2),
            max_features=200,
            min_df=1
        )
        tfidf_matrix = vectorizer.fit_transform(sentences)
        feature_names = vectorizer.get_feature_names_out()
        scores = np.asarray(tfidf_matrix.mean(axis=0)).flatten()
        top_indices = scores.argsort()[-top_n:][::-1]
        return [(feature_names[i], float(scores[i])) for i in top_indices]
    except Exception:
        # Fallback: simple word frequency
        words = re.findall(r'\b[a-z][a-z+#.\-]{2,}\b', text.lower())
        freq = {}
        for w in words:
            if w not in CUSTOM_STOP_WORDS:
                freq[w] = freq.get(w, 0) + 1
        sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
        return [(w, float(c)) for w, c in sorted_words[:top_n]]


def compute_similarity_score(resume_text: str, jd_text: str) -> float:
    """
    Cosine similarity between resume and JD using TF-IDF vectors.
    Returns 0-100 score.
    """
    try:
        vectorizer = TfidfVectorizer(
            stop_words=CUSTOM_STOP_WORDS,
            ngram_range=(1, 2)
        )
        matrix = vectorizer.fit_transform([resume_text, jd_text])
        score = cosine_similarity(matrix[0:1], matrix[1:2])[0][0]
        return round(float(score) * 100, 2)
    except Exception:
        return 0.0


def get_keyword_matches(
    resume_text: str,
    jd_keywords: List[Tuple[str, float]]
) -> Tuple[List[Dict], List[str]]:
    """
    For each JD keyword, check if it appears in resume.
    Returns (matched_list, missing_list)
    """
    resume_lower = resume_text.lower()
    matched = []
    missing = []

    # Compute max score for relative importance
    max_score = max([s for _, s in jd_keywords], default=1)

    for keyword, score in jd_keywords:
        found = keyword.lower() in resume_lower
        frequency = resume_lower.count(keyword.lower())

        # Importance tier based on TF-IDF score
        relative = score / max_score if max_score > 0 else 0
        if relative > 0.6:
            importance = "high"
        elif relative > 0.3:
            importance = "medium"
        else:
            importance = "low"

        if found:
            matched.append({
                "keyword": keyword,
                "found_in_resume": True,
                "frequency": frequency,
                "importance": importance,
            })
        else:
            if importance in ("high", "medium"):
                missing.append(keyword)

    return matched, missing


def detect_sections(resume_text: str) -> List[Dict]:
    """
    Detect which standard resume sections are present.
    Returns list of section results with scores and tips.
    """
    text_lower = resume_text.lower()
    results = []

    tips = {
        "summary": "Add a 2-3 sentence professional summary at the top. Many ATS rank this highly.",
        "experience": "List experience with company, title, dates and bullet points. Use action verbs.",
        "education": "Include degree, institution, graduation year. Don't bury this section.",
        "skills": "Add a dedicated skills section with specific tech/tools. ATS scan this directly.",
        "projects": "Projects section is crucial for CS roles — include tech stack used.",
        "certifications": "Certifications can boost ATS score for technical roles significantly.",
        "achievements": "Quantify achievements with numbers (%, $, X times) for stronger impact.",
    }

    for section_name, patterns in SECTION_PATTERNS.items():
        found = any(
            re.search(pat, text_lower, re.IGNORECASE)
            for pat in patterns
        )
        results.append({
            "name": section_name.title(),
            "found": found,
            "score": 100.0 if found else 0.0,
            "tip": None if found else tips.get(section_name),
        })

    return results


def analyze_action_verbs(resume_text: str) -> float:
    """
    Check usage of strong action verbs.
    Returns 0-100 score.
    """
    text_lower = resume_text.lower()
    words = set(re.findall(r'\b\w+\b', text_lower))

    strong_found = words.intersection(STRONG_ACTION_VERBS)
    weak_found = words.intersection(WEAK_VERBS)

    # Score: reward strong, penalize weak
    base_score = min(len(strong_found) * 10, 80)
    weak_penalty = len(weak_found) * 5
    score = max(0, min(100, base_score - weak_penalty))

    return float(score)


def compute_keyword_density(resume_text: str, jd_text: str) -> float:
    """
    Check if keyword density is in a good range (not stuffed, not sparse).
    Returns 0-100 score.
    """
    resume_words = re.findall(r'\b\w+\b', resume_text.lower())
    jd_words = set(re.findall(r'\b\w+\b', jd_text.lower())) - set(CUSTOM_STOP_WORDS)

    if not resume_words:
        return 0.0

    matches = sum(1 for w in resume_words if w in jd_words)
    density = matches / len(resume_words)

    # Ideal density: 3-12% of words match JD terms
    if 0.03 <= density <= 0.12:
        return 100.0
    elif density < 0.03:
        return density / 0.03 * 100
    else:
        # Over-stuffed penalty
        return max(0, 100 - (density - 0.12) * 500)


def get_reading_ease(text: str) -> str:
    """Simple readability label based on avg sentence length."""
    sentences = re.split(r'[.!?]', text)
    sentences = [s for s in sentences if len(s.strip()) > 5]
    if not sentences:
        return "Unknown"
    avg_len = sum(len(s.split()) for s in sentences) / len(sentences)
    if avg_len < 15:
        return "Easy"
    elif avg_len < 25:
        return "Moderate"
    else:
        return "Complex"