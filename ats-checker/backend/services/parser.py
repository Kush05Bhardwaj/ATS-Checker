from fastapi import UploadFile
from typing import Optional
import io

def _read_bytes(upload_file: UploadFile) -> bytes:
    return upload_file.file.read()


async def extract_text(upload_file: UploadFile) -> str:
    """Try to extract text from common resume file types (.txt, .docx, .pdf).
    This is a simple, best-effort extractor for the scaffold.
    """
    filename = upload_file.filename or "file"
    data = _read_bytes(upload_file)

    if filename.lower().endswith(".txt"):
        try:
            return data.decode("utf-8", errors="replace")
        except Exception:
            return data.decode("latin-1", errors="replace")

    if filename.lower().endswith(".docx"):
        try:
            from docx import Document

            bio = io.BytesIO(data)
            doc = Document(bio)
            paragraphs = [p.text for p in doc.paragraphs]
            return "\n".join(paragraphs)
        except Exception:
            return ""

    if filename.lower().endswith(".pdf"):
        try:
            from pdfminer.high_level import extract_text as pdf_extract

            bio = io.BytesIO(data)
            text = pdf_extract(bio)
            return text or ""
        except Exception:
            return ""

    # fallback: try decode
    try:
        return data.decode("utf-8", errors="replace")
    except Exception:
        return data.decode("latin-1", errors="replace")
