"""
models/schemas.py
All Pydantic request/response models for the API
"""

from pydantic import BaseModel
from typing import List, Optional, Dict


class AnalyzeRequest(BaseModel):
    job_description: str
    use_ai_suggestions: bool = False  # Set True if Anthropic API key is set


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
    keyword_match: float       # 40% weight
    section_completeness: float  # 20% weight
    format_compatibility: float  # 20% weight
    keyword_density: float     # 10% weight
    action_verbs: float        # 10% weight


class AnalyzeResponse(BaseModel):
    overall_score: float
    score_label: str           # "Excellent" | "Good" | "Fair" | "Poor"
    score_breakdown: ScoreBreakdown
    matched_keywords: List[KeywordMatch]
    missing_keywords: List[str]
    sections: List[SectionResult]
    format_issues: List[FormatIssue]
    ai_suggestions: Optional[List[str]] = None
    word_count: int
    reading_ease: str