# services package
from .parser import parse_pdf, parse_docx, clean_text
from .nlp_engine import (
    extract_keywords_tfidf,
    compute_similarity_score,
    get_keyword_matches,
    detect_sections,
    analyze_action_verbs,
    compute_keyword_density,
    get_reading_ease,
)
from .format_checker import analyze_format
from .scorer import compute_final_score, get_score_label
from .ai_suggestions import get_ai_suggestions