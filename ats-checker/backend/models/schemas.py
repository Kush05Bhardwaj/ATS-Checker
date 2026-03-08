"""
models/schemas.py
All Pydantic request/response models for the API
"""

from pydantic import BaseModel
from typing import List, Optional


class AnalyzeRequest(BaseModel):
    job_description: str
    use_ai_suggestions: bool = False
    experience_level: str = "mid"   # "fresher" | "mid" | "senior" | "executive"
    resume_pages: int = 1           # 1 | 2 | 3


class KeywordMatch(BaseModel):
    keyword: str
    found_in_resume: bool
    frequency: int
    importance: str  # "high" | "medium" | "low"


class SectionResult(BaseModel):
    name: str
    found: bool
    score: float
    tip: Optional[str] = None


class FormatIssue(BaseModel):
    issue: str
    severity: str  # "critical" | "warning" | "info"
    fix: str


class ScoreBreakdown(BaseModel):
    keyword_match: float
    section_completeness: float
    format_compatibility: float
    keyword_density: float
    action_verbs: float


class AnalyzeResponse(BaseModel):
    overall_score: float
    score_label: str
    score_breakdown: ScoreBreakdown
    matched_keywords: List[KeywordMatch]
    missing_keywords: List[str]
    sections: List[SectionResult]
    format_issues: List[FormatIssue]
    ai_suggestions: Optional[List[str]] = None
    word_count: int
    reading_ease: str
    experience_level: str
    resume_pages: int
    page_verdict: str
