# ⚡ ATS Checker — Free Forever

Your own ATS resume analyzer. No paywalls, no signups, runs locally.

---

## 📁 Project Structure

```
ats-checker/
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── requirements.txt           # Python dependencies
│   ├── .env.example               # Copy to .env, add API keys
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py             # Pydantic request/response models
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── health.py              # GET /api/health
│   │   └── analyze.py             # POST /api/analyze  ← main endpoint
│   └── services/
│       ├── __init__.py
│       ├── parser.py              # PDF + DOCX text extraction
│       ├── nlp_engine.py          # TF-IDF, keyword match, section detect
│       ├── format_checker.py      # ATS format issue detection
│       ├── scorer.py              # Weighted scoring engine
│       └── ai_suggestions.py     # Claude API suggestions (optional)
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx               # React entry point
        ├── App.jsx                # Main UI + state management
        ├── index.css              # Global styles + animations
        ├── utils/
        │   └── api.js             # Axios calls to backend
        └── components/
            ├── UploadZone.jsx     # Drag-and-drop file upload
            ├── ScoreGauge.jsx     # Animated circular score
            ├── BreakdownBar.jsx   # Score breakdown bars
            ├── KeywordsPanel.jsx  # Matched/missing keywords
            ├── SectionsPanel.jsx  # Resume section checker
            ├── FormatIssues.jsx   # ATS format warnings
            └── AISuggestions.jsx  # Claude AI suggestions
```

---

## 🚀 Setup & Run

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Setup env vars
cp .env.example .env
# Edit .env — add ANTHROPIC_API_KEY if you want AI suggestions

# Run server
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

### Frontend

```bash
cd frontend

npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## 🔌 API Endpoints

### `POST /api/analyze`
Multipart form data:
- `resume` — PDF or DOCX file
- `job_description` — string (paste JD text)
- `use_ai_suggestions` — boolean (default: false)

Returns full JSON with score, keywords, sections, format issues.

### `GET /api/health`
Returns `{ "status": "ok" }`

---

## 📊 Scoring Algorithm

| Signal              | Weight |
|---------------------|--------|
| Keyword Match       | 40%    |
| Section Coverage    | 20%    |
| Format Compatibility| 20%    |
| Keyword Density     | 10%    |
| Action Verbs        | 10%    |

---

## 🛠️ Tech Stack

**Backend:** FastAPI, pdfplumber, python-docx, spaCy, scikit-learn, KeyBERT, Anthropic
**Frontend:** React 18, Vite, Tailwind CSS, Recharts, Axios, react-dropzone

---

## 🚢 Deployment

**Backend** → Railway / Render (free tier works)
**Frontend** → Vercel (`npm run build` → deploy `dist/`)

Update `vite.config.js` proxy target to your deployed backend URL for production.