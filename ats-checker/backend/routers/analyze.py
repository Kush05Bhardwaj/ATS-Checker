"""
routers/analyze.py
POST /api/analyze — Main ATS analysis endpoint.
Accepts multipart form: resume file + job description text.
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from models.schemas import AnalyzeResponse, KeywordMatch, SectionResult, FormatIssue, ScoreBreakdown
from services import (
    parse_pdf, parse_docx, clean_text,
    extract_keywords_tfidf, compute_similarity_score,
    get_keyword_matches, detect_sections,
    analyze_action_verbs, compute_keyword_density,
    get_reading_ease, analyze_format,
    compute_final_score, get_score_label,
    get_ai_suggestions,
)

router = APIRouter()

ALLOWED_TYPES = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/msword": "docx",
}


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    use_ai_suggestions: bool = Form(False),
):
    # ── 1. Validate file type ─────────────────────────────────────────────────
    content_type = resume.content_type or ""
    file_ext = resume.filename.split(".")[-1].lower() if resume.filename else ""

    if content_type in ALLOWED_TYPES:
        file_type = ALLOWED_TYPES[content_type]
    elif file_ext == "pdf":
        file_type = "pdf"
    elif file_ext in ("docx", "doc"):
        file_type = "docx"
    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Upload a PDF or DOCX resume."
        )

    # ── 2. Parse resume ───────────────────────────────────────────────────────
    file_bytes = await resume.read()

    if file_type == "pdf":
        raw_text, file_warnings = parse_pdf(file_bytes)
    else:
        raw_text, file_warnings = parse_docx(file_bytes)

    if not raw_text or len(raw_text.strip()) < 50:
        raise HTTPException(
            status_code=422,
            detail="Could not extract text from resume. Make sure it's not image-only or password protected."
        )

    resume_text = clean_text(raw_text)
    jd_text = clean_text(job_description)

    # ── 3. NLP Processing ─────────────────────────────────────────────────────

    # Extract keywords from JD
    jd_keywords = extract_keywords_tfidf(jd_text, top_n=40)

    # Cosine similarity score (0-100) → this IS our keyword_match score
    keyword_match_score = compute_similarity_score(resume_text, jd_text)

    # Which JD keywords appear in resume?
    matched_raw, missing_keywords = get_keyword_matches(resume_text, jd_keywords)

    # Section detection
    sections_raw = detect_sections(resume_text)

    # Action verb quality
    action_verb_score = analyze_action_verbs(resume_text)

    # Keyword density
    density_score = compute_keyword_density(resume_text, jd_text)

    # ── 4. Format Analysis ────────────────────────────────────────────────────
    format_issues_raw, format_score = analyze_format(resume_text, file_warnings, file_type)

    # ── 5. Final Score ────────────────────────────────────────────────────────
    overall_score, breakdown = compute_final_score(
        keyword_match=keyword_match_score,
        sections=sections_raw,
        format_score=format_score,
        keyword_density=density_score,
        action_verbs=action_verb_score,
    )

    # ── 6. AI Suggestions (optional) ─────────────────────────────────────────
    ai_suggestions = None
    if use_ai_suggestions:
        ai_suggestions = get_ai_suggestions(
            resume_text=resume_text,
            jd_text=jd_text,
            missing_keywords=missing_keywords,
            overall_score=overall_score,
        )

    # ── 7. Build Response ─────────────────────────────────────────────────────
    return AnalyzeResponse(
        overall_score=overall_score,
        score_label=get_score_label(overall_score),
        score_breakdown=ScoreBreakdown(**breakdown),
        matched_keywords=[KeywordMatch(**k) for k in matched_raw],
        missing_keywords=missing_keywords[:20],
        sections=[SectionResult(**s) for s in sections_raw],
        format_issues=[FormatIssue(**f) for f in format_issues_raw],
        ai_suggestions=ai_suggestions,
        word_count=len(resume_text.split()),
        reading_ease=get_reading_ease(resume_text),
    )