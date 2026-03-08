// src/App.jsx
import React, { useState } from 'react'
import { analyzeResume } from './utils/api'
import UploadZone from './components/UploadZone'
import ScoreGauge from './components/ScoreGauge'
import BreakdownBar from './components/BreakdownBar'
import KeywordsPanel from './components/KeywordsPanel'
import SectionsPanel from './components/SectionsPanel'
import FormatIssues from './components/FormatIssues'
import AISuggestions from './components/AISuggestions'

function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${className}`}
      style={{ borderColor: '#1e1e2e', background: '#111118' }}
    >
      {children}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h3 className="font-mono font-bold text-xs text-slate-500 uppercase tracking-widest mb-4">
      {children}
    </h3>
  )
}

export default function App() {
  const [file, setFile] = useState(null)
  const [jd, setJd] = useState('')
  const [useAI, setUseAI] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function handleAnalyze() {
    if (!file) return setError('Please upload your resume first.')
    if (!jd.trim()) return setError('Please paste a job description.')
    setError(null)
    setLoading(true)
    setResult(null)

    try {
      const data = await analyzeResume({ file, jobDescription: jd, useAI })
      setResult(data)
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || 'Something went wrong.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setFile(null)
    setJd('')
    setResult(null)
    setError(null)
    setUseAI(false)
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: '#1e1e2e' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h1 className="font-mono font-bold text-lg text-white leading-none">ATS Checker</h1>
              <p className="text-[10px] text-slate-500 font-mono">free forever · no signup</p>
            </div>
          </div>
          {result && (
            <button
              onClick={handleReset}
              className="text-xs font-mono text-slate-500 hover:text-accent transition-colors px-3 py-1.5 rounded-lg border"
              style={{ borderColor: '#1e1e2e' }}
            >
              ← Analyze Another
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* ─── Input Section ────────────────────────────────────────────────── */}
        {!result && (
          <div className="max-w-2xl mx-auto space-y-6 fade-up">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold text-white">
                Know your real <span style={{ color: '#6ee7b7' }}>ATS score</span>
              </h2>
              <p className="text-slate-400 text-sm">
                No paywalls. No signups. Just drop your resume + job description.
              </p>
            </div>

            <Card>
              <SectionTitle>Step 1 — Upload Resume</SectionTitle>
              <UploadZone file={file} onFile={setFile} />
            </Card>

            <Card>
              <SectionTitle>Step 2 — Paste Job Description</SectionTitle>
              <textarea
                className="w-full rounded-xl p-4 text-sm text-slate-300 resize-none focus:outline-none font-sans"
                style={{
                  background: '#0a0a0f',
                  border: '1px solid #1e1e2e',
                  minHeight: '200px',
                }}
                placeholder="Paste the full job description here. The more detail, the better the analysis..."
                value={jd}
                onChange={e => setJd(e.target.value)}
              />
              <div className="mt-2 text-right">
                <span className="font-mono text-[10px] text-slate-600">
                  {jd.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-300">
                    ✨ AI-Powered Suggestions
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Uses Claude API for smart, contextual feedback (requires ANTHROPIC_API_KEY in backend)
                  </p>
                </div>
                <button
                  onClick={() => setUseAI(!useAI)}
                  className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
                  style={{ background: useAI ? '#6ee7b7' : '#1e1e2e' }}
                >
                  <span
                    className="absolute top-1 w-4 h-4 rounded-full transition-all duration-200"
                    style={{
                      background: useAI ? '#0a0a0f' : '#64748b',
                      left: useAI ? '24px' : '4px',
                    }}
                  />
                </button>
              </div>
            </Card>

            {error && (
              <div
                className="rounded-xl p-4 border text-sm"
                style={{ background: '#f8717112', borderColor: '#f8717130', color: '#f87171' }}
              >
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-mono font-bold text-sm transition-all duration-200 disabled:opacity-50"
              style={{
                background: loading ? '#1e1e2e' : '#6ee7b7',
                color: loading ? '#64748b' : '#0a0a0f',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⟳</span>
                  Analyzing your resume...
                </span>
              ) : (
                '⚡ Analyze ATS Score'
              )}
            </button>
          </div>
        )}

        {/* ─── Results Section ──────────────────────────────────────────────── */}
        {result && (
          <div className="space-y-6 stagger">

            {/* Top row: Score + Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Score Gauge */}
              <Card className="flex flex-col items-center justify-center gap-6 md:col-span-1">
                <SectionTitle>ATS Score</SectionTitle>
                <ScoreGauge score={result.overall_score} label={result.score_label} />
                <div className="w-full pt-3 border-t space-y-1" style={{ borderColor: '#1e1e2e' }}>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-sans">Words</span>
                    <span className="font-mono text-slate-300">{result.word_count}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-sans">Readability</span>
                    <span className="font-mono text-slate-300">{result.reading_ease}</span>
                  </div>
                </div>
              </Card>

              {/* Score Breakdown */}
              <Card className="md:col-span-2">
                <SectionTitle>Score Breakdown</SectionTitle>
                <BreakdownBar breakdown={result.score_breakdown} />
              </Card>
            </div>

            {/* AI Suggestions */}
            {result.ai_suggestions && (
              <AISuggestions suggestions={result.ai_suggestions} />
            )}

            {/* Keywords */}
            <Card>
              <SectionTitle>Keyword Analysis</SectionTitle>
              <KeywordsPanel
                matched={result.matched_keywords}
                missing={result.missing_keywords}
              />
            </Card>

            {/* Sections + Format */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <SectionTitle>Resume Sections</SectionTitle>
                <SectionsPanel sections={result.sections} />
              </Card>
              <Card>
                <SectionTitle>Format Issues</SectionTitle>
                <FormatIssues issues={result.format_issues} />
              </Card>
            </div>

          </div>
        )}
      </main>

      <footer className="text-center py-8 text-slate-600 text-xs font-mono">
        built for devs who hate paywalls ⚡
      </footer>
    </div>
  )
}