"""
routers/analyze.py
POST /api/analyze
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

VALID_LEVELS = {"fresher", "mid", "senior", "executive"}

# Ideal page counts per level
IDEAL_PAGES = {
    "fresher":   {"min": 1, "max": 1},
    "mid":       {"min": 1, "max": 2},
    "senior":    {"min": 1, "max": 2},
    "executive": {"min": 2, "max": 3},
}

def get_page_verdict(experience_level: str, resume_pages: int) -> str:
    ideal = IDEAL_PAGES.get(experience_level, {"min": 1, "max": 2})
    level_labels = {
        "fresher": "Fresher",
        "mid": "Mid-level",
        "senior": "Senior",
        "executive": "Executive",
    }
    label = level_labels.get(experience_level, experience_level.title())

    if resume_pages < ideal["min"]:
        return f" Too short for {label} — aim for at least {ideal['min']} page(s)"
    elif resume_pages > ideal["max"]:
        return f" Too long for {label} — keep it to {ideal['max']} page(s) max"
    else:
        return f" Ideal length for {label} ({resume_pages} page{'s' if resume_pages > 1 else ''})"


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    use_ai_suggestions: bool = Form(False),
    experience_level: str = Form("mid"),
    resume_pages: int = Form(1),
):
    #  Validate experience level 
    if experience_level not in VALID_LEVELS:
        experience_level = "mid"

    resume_pages = max(1, min(resume_pages, 10))

    #  Validate file type 
    content_type = resume.content_type or ""
    file_ext = resume.filename.split(".")[-1].lower() if resume.filename else ""

    if content_type in ALLOWED_TYPES:
        file_type = ALLOWED_TYPES[content_type]
    elif file_ext == "pdf":
        file_type = "pdf"
    elif file_ext in ("docx", "doc"):
        file_type = "docx"
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type. Upload a PDF or DOCX resume.")

    #  Parse resume 
    file_bytes = await resume.read()
    if file_type == "pdf":
        raw_text, file_warnings = parse_pdf(file_bytes)
    else:
        raw_text, file_warnings = parse_docx(file_bytes)

    if not raw_text or len(raw_text.strip()) < 50:
        raise HTTPException(
            status_code=422,
            detail="Could not extract text from resume. Make sure it is not image-only or password protected."
        )

    resume_text = clean_text(raw_text)
    jd_text = clean_text(job_description)

    #  NLP 
    jd_keywords          = extract_keywords_tfidf(jd_text, top_n=40)
    keyword_match_score  = compute_similarity_score(resume_text, jd_text)
    matched_raw, missing = get_keyword_matches(resume_text, jd_keywords)
    sections_raw         = detect_sections(resume_text)
    action_verb_score    = analyze_action_verbs(resume_text)
    density_score        = compute_keyword_density(resume_text, jd_text)

    #  Format analysis (now page-aware) 
    format_issues_raw, format_score = analyze_format(
        resume_text, file_warnings, file_type,
        experience_level=experience_level,
        resume_pages=resume_pages,
    )

    #  Scoring (experience-aware weights) 
    overall_score, breakdown = compute_final_score(
        keyword_match=keyword_match_score,
        sections=sections_raw,
        format_score=format_score,
        keyword_density=density_score,
        action_verbs=action_verb_score,
        experience_level=experience_level,
    )

    #  AI suggestions 
    ai_suggestions = None
    if use_ai_suggestions:
        ai_suggestions = get_ai_suggestions(
            resume_text=resume_text,
            jd_text=jd_text,
            missing_keywords=missing,
            overall_score=overall_score,
        )

    return AnalyzeResponse(
        overall_score=overall_score,
        score_label=get_score_label(overall_score),
        score_breakdown=ScoreBreakdown(**breakdown),
        matched_keywords=[KeywordMatch(**k) for k in matched_raw],
        missing_keywords=missing[:20],
        sections=[SectionResult(**s) for s in sections_raw],
        format_issues=[FormatIssue(**f) for f in format_issues_raw],
        ai_suggestions=ai_suggestions,
        word_count=len(resume_text.split()),
        reading_ease=get_reading_ease(resume_text),
        experience_level=experience_level,
        resume_pages=resume_pages,
        page_verdict=get_page_verdict(experience_level, resume_pages),
    )
