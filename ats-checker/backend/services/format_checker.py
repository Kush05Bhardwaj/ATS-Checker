"""
services/format_checker.py
Analyzes resume text and file-level warnings for ATS compatibility issues.
"""

import re
from typing import List, Dict


def analyze_format(
    resume_text: str,
    file_warnings: List[str],
    file_type: str
) -> tuple[List[Dict], float]:
    """
    Check for ATS-unfriendly formatting.
    Returns (issues_list, format_score 0-100)
    """
    issues = []
    penalty = 0

    # ── File-level issues from parser ─────────────────────────────────────────

    if any("table" in w for w in file_warnings):
        issues.append({
            "issue": "Tables detected in resume",
            "severity": "critical",
            "fix": "Replace all tables with plain bullet points. ATS parsers often skip table content entirely."
        })
        penalty += 25

    if any("multi_column" in w for w in file_warnings):
        issues.append({
            "issue": "Multi-column layout detected",
            "severity": "critical",
            "fix": "Use a single-column layout. ATS reads left-to-right and multi-column causes text to mix incorrectly."
        })
        penalty += 25

    if any("image" in w for w in file_warnings):
        issues.append({
            "issue": "Images or graphics found",
            "severity": "warning",
            "fix": "Remove photos, logos, and icons. ATS cannot read image-based content."
        })
        penalty += 10

    if any("header" in w for w in file_warnings):
        issues.append({
            "issue": "Key content detected in headers/footers",
            "severity": "warning",
            "fix": "Move contact info from headers to the main body. ATS often skips header/footer regions."
        })
        penalty += 10

    if any("text_box" in w for w in file_warnings):
        issues.append({
            "issue": "Text boxes detected",
            "severity": "critical",
            "fix": "Remove all text boxes. Content inside text boxes is invisible to ATS."
        })
        penalty += 20

    # ── Content-level issues ──────────────────────────────────────────────────

    # Check for special characters used as bullet substitutes
    special_bullets = re.findall(r'[★✓✗►▶◆●•❖]', resume_text)
    if len(special_bullets) > 5:
        issues.append({
            "issue": "Special Unicode bullet characters found",
            "severity": "warning",
            "fix": "Use standard hyphens (-) or plain bullets (•). Unicode symbols can confuse ATS parsers."
        })
        penalty += 5

    # Check for very short resume (thin content = bad score)
    word_count = len(resume_text.split())
    if word_count < 200:
        issues.append({
            "issue": f"Resume is very short ({word_count} words)",
            "severity": "warning",
            "fix": "Aim for 400-700 words. Too short means insufficient keyword coverage for ATS."
        })
        penalty += 10
    elif word_count > 1000:
        issues.append({
            "issue": f"Resume may be too long ({word_count} words)",
            "severity": "info",
            "fix": "Try to keep it under 700 words (1 page for <5 yrs exp, 2 pages max). ATS ranks concise resumes higher."
        })
        penalty += 5

    # Check for date formats
    date_patterns = re.findall(r'\b\d{1,2}/\d{4}\b|\b\d{4}-\d{2}\b', resume_text)
    text_dates = re.findall(
        r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b',
        resume_text
    )
    if not date_patterns and not text_dates:
        issues.append({
            "issue": "No clear date formats detected",
            "severity": "info",
            "fix": "Use consistent date formats (e.g., 'Jan 2022 – Present') for experience entries."
        })
        penalty += 5

    # Check contact info presence
    email_found = bool(re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', resume_text))
    phone_found = bool(re.search(r'\+?\d[\d\s\-().]{8,}\d', resume_text))

    if not email_found:
        issues.append({
            "issue": "No email address detected",
            "severity": "critical",
            "fix": "Add your email address in plain text in the resume body (not in a header/image)."
        })
        penalty += 15

    if not phone_found:
        issues.append({
            "issue": "No phone number detected",
            "severity": "warning",
            "fix": "Include a phone number in plain text format."
        })
        penalty += 5

    # File type check
    if file_type == "pdf":
        issues.append({
            "issue": "PDF format — generally ATS-safe",
            "severity": "info",
            "fix": "✅ PDF is acceptable, but DOCX is safer for some older ATS systems. Test both if possible."
        })

    format_score = max(0.0, 100.0 - penalty)
    return issues, format_score