"""
services/format_checker.py
Analyzes resume text and file-level warnings for ATS compatibility issues.
Now experience_level and resume_pages aware.
"""

import re
from typing import List, Dict, Tuple

# Ideal word counts per level
WORD_TARGETS = {
    "fresher":   {"min": 250,  "max": 500},
    "mid":       {"min": 400,  "max": 700},
    "senior":    {"min": 500,  "max": 900},
    "executive": {"min": 600,  "max": 1100},
}

IDEAL_PAGES = {
    "fresher":   {"min": 1, "max": 1},
    "mid":       {"min": 1, "max": 2},
    "senior":    {"min": 1, "max": 2},
    "executive": {"min": 2, "max": 3},
}


def analyze_format(
    resume_text: str,
    file_warnings: List[str],
    file_type: str,
    experience_level: str = "mid",
    resume_pages: int = 1,
) -> Tuple[List[Dict], float]:
    issues = []
    penalty = 0

    #  File-level issues 
    if any("table" in w for w in file_warnings):
        issues.append({
            "issue": "Tables detected in resume",
            "severity": "critical",
            "fix": "Replace tables with plain bullet points. ATS parsers often skip table content entirely."
        })
        penalty += 25

    if any("multi_column" in w for w in file_warnings):
        issues.append({
            "issue": "Multi-column layout detected",
            "severity": "critical",
            "fix": "Use a single-column layout. ATS reads left-to-right and multi-column causes text to mix."
        })
        penalty += 25

    if any("image" in w for w in file_warnings):
        issues.append({
            "issue": "Images or graphics found",
            "severity": "warning",
            "fix": "Remove photos, logos, and icons — ATS cannot read image-based content."
        })
        penalty += 10

    if any("header" in w for w in file_warnings):
        issues.append({
            "issue": "Key content in headers/footers",
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

    #  Page count check 
    ideal = IDEAL_PAGES.get(experience_level, {"min": 1, "max": 2})
    level_label = experience_level.title()

    if resume_pages < ideal["min"]:
        issues.append({
            "issue": f"Resume too short for {level_label} level ({resume_pages} page)",
            "severity": "warning",
            "fix": f"A {level_label} resume should be at least {ideal['min']} page(s). Expand your experience and skills sections."
        })
        penalty += 10
    elif resume_pages > ideal["max"]:
        issues.append({
            "issue": f"Resume too long for {level_label} level ({resume_pages} pages)",
            "severity": "warning" if experience_level != "fresher" else "critical",
            "fix": f"For a {level_label}, keep it to {ideal['max']} page(s) max. Remove old/irrelevant roles and trim bullets."
        })
        penalty += 15 if experience_level == "fresher" else 8
    else:
        issues.append({
            "issue": f"Page count is ideal for {level_label} level",
            "severity": "info",
            "fix": f" {resume_pages} page{'s' if resume_pages > 1 else ''} is the right length for a {level_label} resume."
        })

    #  Word count check (level-aware) 
    wt = WORD_TARGETS.get(experience_level, WORD_TARGETS["mid"])
    word_count = len(resume_text.split())

    if word_count < wt["min"]:
        issues.append({
            "issue": f"Resume too sparse ({word_count} words for {level_label})",
            "severity": "warning",
            "fix": f"Aim for {wt['min']}–{wt['max']} words at the {level_label} level. Expand bullets with metrics and impact."
        })
        penalty += 10
    elif word_count > wt["max"]:
        issues.append({
            "issue": f"Resume too wordy ({word_count} words for {level_label})",
            "severity": "info",
            "fix": f"Ideal range for {level_label} is {wt['min']}–{wt['max']} words. Trim verbose descriptions."
        })
        penalty += 5

    #  Special bullets 
    special_bullets = re.findall(r'[★✓✗►▶◆●•❖■□▪▫→]', resume_text)
    if len(special_bullets) > 5:
        issues.append({
            "issue": "Special Unicode bullet characters found",
            "severity": "warning",
            "fix": "Use standard hyphens (-) or ASCII bullets. Unicode symbols can confuse ATS parsers."
        })
        penalty += 5

    #  Dates 
    date_patterns = re.findall(r'\b\d{1,2}/\d{4}\b|\b\d{4}-\d{2}\b', resume_text)
    text_dates = re.findall(
        r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b',
        resume_text
    )
    if not date_patterns and not text_dates:
        issues.append({
            "issue": "No clear date formats detected",
            "severity": "info",
            "fix": "Use consistent date formats (e.g. 'Jan 2022 – Present') for all experience entries."
        })
        penalty += 5

    #  Contact info 
    if not re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', resume_text):
        issues.append({
            "issue": "No email address detected",
            "severity": "critical",
            "fix": "Add your email in plain text in the resume body (not inside a header/image)."
        })
        penalty += 15

    if not re.search(r'\+?\d[\d\s\-().]{8,}\d', resume_text):
        issues.append({
            "issue": "No phone number detected",
            "severity": "warning",
            "fix": "Include a phone number in plain text format."
        })
        penalty += 5

    #  File format 
    if file_type == "pdf":
        issues.append({
            "issue": "PDF format — generally ATS-safe",
            "severity": "info",
            "fix": "PDF is acceptable. DOCX is safer for some legacy ATS systems. Test both if possible."
        })

    format_score = max(0.0, 100.0 - penalty)
    return issues, format_score
