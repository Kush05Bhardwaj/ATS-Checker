// src/App.jsx
import React, { useState } from 'react'
import { analyzeResume } from './utils/api'
import UploadZone from './components/UploadZone'
import ScoreGauge from './components/ScoreGauge'
import BreakdownBar from './components/BreakdownBar'
import KeywordsPanel from './components/KeywordsPanel'
import SectionsPanel from './components/SectionPanel'
import FormatIssues from './components/FormatIssues'
import AISuggestions from './components/AiSuggestions'

function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 w-full ${className}`}
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
  const [file, setFile]           = useState(null)
  const [jd, setJd]               = useState('')
  const [useAI, setUseAI]         = useState(false)
  const [expLevel, setExpLevel]   = useState('mid')
  const [pages, setPages]         = useState(1)
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState(null)
  const [error, setError]         = useState(null)

  async function handleAnalyze() {
    if (!file) return setError('Please upload your resume first.')
    if (!jd.trim()) return setError('Please paste a job description.')
    setError(null)
    setLoading(true)
    setResult(null)
    try {
      const data = await analyzeResume({ file, jobDescription: jd, useAI, expLevel, pages })
      setResult(data)
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setFile(null); setJd(''); setResult(null); setError(null)
    setUseAI(false); setExpLevel('mid'); setPages(1)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0f' }}>

      {/*  Header  */}
      <header className="border-b sticky top-0 z-10" style={{ borderColor: '#1e1e2e', background: '#0a0a0f' }}>
        <div className="page-wrap py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl"></span>
            <div>
              <h1 className="font-mono font-bold text-base sm:text-lg text-white leading-none">ATS Checker</h1>
              <p className="text-[10px] text-slate-500 font-mono hidden sm:block">free forever  no signup</p>
            </div>
          </div>
          {result && (
            <button
              onClick={handleReset}
              className="text-xs font-mono text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border"
              style={{ borderColor: '#1e1e2e' }}
            >
               New Analysis
            </button>
          )}
        </div>
      </header>

      {/*  Main  */}
      <main className="page-wrap flex-1 py-8 sm:py-10">

        {/* Input section */}
        {!result && (
          <div className="input-col space-y-5 fade-up">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Know your real <span style={{ color: '#6ee7b7' }}>ATS score</span>
              </h2>
              <p className="text-slate-400 text-sm">
                No paywalls. No signups. Drop resume + job description.
              </p>
            </div>

            <Card>
              <SectionTitle>Step 1 — Upload Resume</SectionTitle>
              <UploadZone file={file} onFile={setFile} />
            </Card>

            <Card>
              <SectionTitle>Step 2 — Paste Job Description</SectionTitle>
              <textarea
                className="w-full rounded-xl p-3 sm:p-4 text-sm text-slate-300 resize-none focus:outline-none"
                style={{ background: '#0a0a0f', border: '1px solid #1e1e2e', minHeight: '180px' }}
                placeholder="Paste the full job description here..."
                value={jd}
                onChange={e => setJd(e.target.value)}
              />
              <div className="mt-1.5 text-right">
                <span className="font-mono text-[10px] text-slate-600">
                  {jd.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
            </Card>

            {/* Step 3 — Experience Level */}
            <Card>
              <SectionTitle>Step 3 — Your Experience Level</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'fresher',   label: '🎓 Fresher',   sub: '0–1 yr'   },
                  { id: 'mid',       label: '💼 Mid-Level',  sub: '2–5 yrs'  },
                  { id: 'senior',    label: '🚀 Senior',     sub: '6–10 yrs' },
                  { id: 'executive', label: '🏆 Executive',  sub: '10+ yrs'  },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setExpLevel(opt.id)}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all duration-150"
                    style={expLevel === opt.id
                      ? { borderColor: '#6ee7b7', background: '#6ee7b710', color: '#6ee7b7' }
                      : { borderColor: '#1e1e2e', background: 'transparent', color: '#64748b' }
                    }
                  >
                    <span className="text-sm font-semibold font-mono">{opt.label}</span>
                    <span className="text-[10px] opacity-70">{opt.sub}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Step 4 — Resume Pages */}
            <Card>
              <SectionTitle>Step 4 — How Many Pages Is Your Resume?</SectionTitle>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3].map(n => (
                  <button
                    key={n}
                    onClick={() => setPages(n)}
                    className="flex-1 min-w-[70px] py-3 rounded-xl border font-mono font-bold text-sm transition-all duration-150"
                    style={pages === n
                      ? { borderColor: '#6ee7b7', background: '#6ee7b710', color: '#6ee7b7' }
                      : { borderColor: '#1e1e2e', background: 'transparent', color: '#64748b' }
                    }
                  >
                    {n} {n === 1 ? 'Page' : 'Pages'}
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-300"> AI-Powered Suggestions</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Uses Claude API  requires <span className="font-mono">ANTHROPIC_API_KEY</span> in backend
                  </p>
                </div>
                <button
                  onClick={() => setUseAI(!useAI)}
                  className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
                  style={{ background: useAI ? '#6ee7b7' : '#1e1e2e' }}
                  aria-label="Toggle AI suggestions"
                >
                  <span
                    className="absolute top-1 w-4 h-4 rounded-full transition-all duration-200"
                    style={{ background: useAI ? '#0a0a0f' : '#64748b', left: useAI ? '24px' : '4px' }}
                  />
                </button>
              </div>
            </Card>

            {error && (
              <div className="rounded-xl p-4 border text-sm" style={{ background: '#f8717112', borderColor: '#f8717130', color: '#f87171' }}>
                 {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3.5 sm:py-4 rounded-2xl font-mono font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: loading ? '#1e1e2e' : '#6ee7b7', color: loading ? '#64748b' : '#0a0a0f' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin"></span>
                  Analyzing your resume...
                </span>
              ) : ' Analyze ATS Score'}
            </button>
          </div>
        )}

        {/* Results section */}
        {result && (
          <div className="space-y-5 stagger">

            {/* Score + Breakdown — stack on mobile, side-by-side on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Card className="flex flex-col items-center gap-4 py-6 md:col-span-1">
                <SectionTitle>ATS Score</SectionTitle>
                <ScoreGauge score={result.overall_score} label={result.score_label} />
                <div className="w-full pt-3 border-t space-y-2" style={{ borderColor: '#1e1e2e' }}>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Words</span>
                    <span className="font-mono text-slate-300">{result.word_count}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Readability</span>
                    <span className="font-mono text-slate-300">{result.reading_ease}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Level</span>
                    <span className="font-mono text-slate-300 capitalize">{result.experience_level}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Pages</span>
                    <span className="font-mono text-slate-300">{result.resume_pages}</span>
                  </div>
                  <div
                    className="mt-2 rounded-lg px-2.5 py-1.5 text-[11px] leading-snug font-mono"
                    style={{
                      background: result.page_verdict?.startsWith('✅') ? '#6ee7b710' : '#fbbf2410',
                      color:      result.page_verdict?.startsWith('✅') ? '#6ee7b7'   : '#fbbf24',
                      border:     `1px solid ${result.page_verdict?.startsWith('✅') ? '#6ee7b730' : '#fbbf2430'}`,
                    }}
                  >
                    {result.page_verdict}
                  </div>
                </div>
              </Card>

              <Card className="md:col-span-2">
                <SectionTitle>Score Breakdown</SectionTitle>
                <BreakdownBar breakdown={result.score_breakdown} />
              </Card>
            </div>

            {/* AI Suggestions */}
            {result.ai_suggestions && (
              <AISuggestions suggestions={result.ai_suggestions} />
            )}

            {/* Keywords — full width */}
            <Card>
              <SectionTitle>Keyword Analysis</SectionTitle>
              <KeywordsPanel matched={result.matched_keywords} missing={result.missing_keywords} />
            </Card>

            {/* Sections + Format — stack on mobile, 2-col on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

      <footer className="text-center py-6 text-slate-600 text-xs font-mono">
        built for devs who hate paywalls 
      </footer>
    </div>
  )
}
