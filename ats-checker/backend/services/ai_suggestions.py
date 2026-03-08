"""
services/ai_suggestions.py
Optional: Uses Anthropic Claude API to generate smart,
context-aware resume improvement suggestions.
Set ANTHROPIC_API_KEY in .env to enable.
"""

import os
from typing import List, Optional


def get_ai_suggestions(
    resume_text: str,
    jd_text: str,
    missing_keywords: List[str],
    overall_score: float,
) -> Optional[List[str]]:
    """
    Call Claude API to get actionable improvement suggestions.
    Returns None if API key not set.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    if not api_key:
        return None

    try:
        import anthropic

        client = anthropic.Anthropic(api_key=api_key)

        missing_kw_str = ", ".join(missing_keywords[:15]) if missing_keywords else "none"

        prompt = f"""You are an expert resume coach and ATS specialist.

A candidate's resume scored {overall_score}/100 on ATS compatibility.

RESUME (first 1500 chars):
{resume_text[:1500]}

JOB DESCRIPTION (first 800 chars):
{jd_text[:800]}

MISSING KEYWORDS FROM JD: {missing_kw_str}

Give exactly 5 specific, actionable suggestions to improve this resume's ATS score.
Each suggestion must be:
- Concrete (tell them exactly what to change or add)
- Relevant to the job description
- Practical (something they can implement today)

Format: Return ONLY a JSON array of 5 strings, no preamble, no markdown.
Example: ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5"]
"""

        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=800,
            messages=[{"role": "user", "content": prompt}]
        )

        import json
        raw = response.content[0].text.strip()
        # Strip markdown fences if present
        raw = raw.replace("```json", "").replace("```", "").strip()
        suggestions = json.loads(raw)

        if isinstance(suggestions, list):
            return [str(s) for s in suggestions[:5]]
        return None

    except Exception as e:
        print(f"[AI Suggestions] Error: {e}")
        return None