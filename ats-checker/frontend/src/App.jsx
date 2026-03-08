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

/* ─── Reusable primitives ───────────────────────────────────── */

function Card({ children, className = '', style = {} }) {
  return (
    <div
      className={`glass-card p-5 sm:p-6 w-full ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="font-code text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-1">
      {children}
    </p>
  )
}

function CardTitle({ children }) {
  return (
    <h3 className="text-base font-semibold text-white mb-4 leading-snug">
      {children}
    </h3>
  )
}

function Divider() {
  return <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
}

/* ─── App ───────────────────────────────────────────────────── */

export default function App() {
  const [file, setFile]         = useState(null)
  const [jd, setJd]             = useState('')
  const [useAI, setUseAI]       = useState(false)
  const [expLevel, setExpLevel] = useState('mid')
  const [pages, setPages]       = useState(1)
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState(null)
  const [error, setError]       = useState(null)

  async function handleAnalyze() {
    if (!file) return setError('Please upload your resume first.')
    if (!jd.trim()) return setError('Please paste a job description.')
    setError(null); setLoading(true); setResult(null)
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

  const expOptions = [
    { id: 'fresher',   emoji: '🎓', label: 'Fresher',   sub: '0 – 1 yr'   },
    { id: 'mid',       emoji: '💼', label: 'Mid-Level',  sub: '2 – 5 yrs'  },
    { id: 'senior',    emoji: '🚀', label: 'Senior',     sub: '6 – 10 yrs' },
    { id: 'executive', emoji: '🏆', label: 'Executive',  sub: '10+ yrs'    },
  ]

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: '#080810' }}>

      {/* Ambient background */}
      <div className="ambient">
        <div className="ambient-blob" style={{ width: 600, height: 600, top: -150, left: -150, background: '#6ee7b7' }} />
        <div className="ambient-blob" style={{ width: 500, height: 500, bottom: -100, right: -100, background: '#38bdf8' }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Header ── */}
        <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,8,16,0.85)', backdropFilter: 'blur(16px)' }} className="sticky top-0 z-20">
          <div className="page-wrap py-4 flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#6ee7b720,#38bdf720)', border: '1px solid rgba(110,231,183,0.25)' }}
              >
                📄
              </div>
              <div>
                <h1 className="font-semibold text-white text-base leading-none tracking-tight">
                  ATS Checker
                </h1>
                <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
                  free forever · no signup · no data stored
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {result && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors px-3.5 py-2 rounded-xl"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  New Analysis
                </button>
              )}
              <a
                href="https://github.com/Kush05Bhardwaj/ATS-Checker"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors px-3.5 py-2 rounded-xl hidden sm:flex"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </a>
            </div>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="page-wrap flex-1 py-10 sm:py-14">

          {/* ── INPUT FORM ── */}
          {!result && (
            <div className="input-col space-y-4 fade-up">

              {/* Hero */}
              <div className="text-center space-y-3 mb-8">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-2"
                  style={{ background: 'rgba(110,231,183,0.08)', border: '1px solid rgba(110,231,183,0.2)', color: '#6ee7b7' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  AI-powered resume analysis
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
                  Will your resume pass<br />
                  <span className="grad-text">the ATS filter?</span>
                </h2>
                <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                  Upload your resume and paste the job description. Get a detailed ATS compatibility score in seconds.
                </p>
              </div>

              {/* Step 1 */}
              <Card>
                <SectionLabel>Step 01</SectionLabel>
                <CardTitle>Upload Your Resume</CardTitle>
                <UploadZone file={file} onFile={setFile} />
              </Card>

              {/* Step 2 */}
              <Card>
                <SectionLabel>Step 02</SectionLabel>
                <CardTitle>Paste Job Description</CardTitle>
                <textarea
                  className="w-full rounded-xl p-4 text-sm text-slate-300 resize-none focus:outline-none transition-colors duration-150"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    minHeight: '160px',
                    lineHeight: '1.6',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(110,231,183,0.3)')}
                  onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
                  placeholder="Paste the full job description here — include requirements, responsibilities, and skills..."
                  value={jd}
                  onChange={e => setJd(e.target.value)}
                />
                <p className="mt-2 text-right font-code text-[10px] text-slate-600">
                  {jd.split(/\s+/).filter(Boolean).length} words
                </p>
              </Card>

              {/* Step 3 */}
              <Card>
                <SectionLabel>Step 03</SectionLabel>
                <CardTitle>Your Experience Level</CardTitle>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {expOptions.map(opt => {
                    const active = expLevel === opt.id
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setExpLevel(opt.id)}
                        className="flex flex-col items-center gap-1.5 p-3.5 rounded-xl transition-all duration-150 text-center"
                        style={active
                          ? { background: 'rgba(110,231,183,0.08)', border: '1px solid rgba(110,231,183,0.35)', color: '#6ee7b7' }
                          : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b' }
                        }
                      >
                        <span className="text-xl">{opt.emoji}</span>
                        <span className="text-xs font-semibold leading-none">{opt.label}</span>
                        <span className="text-[10px] opacity-60 font-code">{opt.sub}</span>
                      </button>
                    )
                  })}
                </div>
              </Card>

              {/* Step 4 */}
              <Card>
                <SectionLabel>Step 04</SectionLabel>
                <CardTitle>Resume Length</CardTitle>
                <div className="flex gap-2.5">
                  {[
                    { n: 1, label: '1 Page',  sub: 'Fresher / concise' },
                    { n: 2, label: '2 Pages', sub: 'Standard'          },
                    { n: 3, label: '3 Pages', sub: 'Senior / detailed' },
                  ].map(({ n, label, sub }) => {
                    const active = pages === n
                    return (
                      <button
                        key={n}
                        onClick={() => setPages(n)}
                        className="flex-1 flex flex-col items-center gap-1 py-3.5 px-2 rounded-xl transition-all duration-150"
                        style={active
                          ? { background: 'rgba(110,231,183,0.08)', border: '1px solid rgba(110,231,183,0.35)', color: '#6ee7b7' }
                          : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b' }
                        }
                      >
                        <span className="text-sm font-semibold font-code">{label}</span>
                        <span className="text-[10px] opacity-60">{sub}</span>
                      </button>
                    )
                  })}
                </div>
              </Card>

              {/* AI toggle */}
              <Card>
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white flex items-center gap-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-md font-code"
                        style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}
                      >
                        BETA
                      </span>
                      AI-Powered Suggestions
                    </p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Uses Claude API · Requires <span className="font-code text-slate-400">ANTHROPIC_API_KEY</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setUseAI(!useAI)}
                    className="relative w-12 h-6 rounded-full transition-all duration-250 flex-shrink-0"
                    style={{ background: useAI ? '#6ee7b7' : 'rgba(255,255,255,0.08)' }}
                    aria-label="Toggle AI suggestions"
                  >
                    <span
                      className="absolute top-1 w-4 h-4 rounded-full transition-all duration-200 shadow-md"
                      style={{ background: useAI ? '#080810' : '#64748b', left: useAI ? '26px' : '4px' }}
                    />
                  </button>
                </div>
              </Card>

              {/* Error */}
              {error && (
                <div
                  className="rounded-xl px-4 py-3.5 text-sm flex items-center gap-2.5"
                  style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 8v4m0 4h.01"/></svg>
                  {error}
                </div>
              )}

              {/* CTA */}
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                style={{
                  background: loading ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#6ee7b7,#38bdf8)',
                  color: loading ? '#64748b' : '#080810',
                  boxShadow: loading ? 'none' : '0 0 32px rgba(110,231,183,0.25)',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                    Analyzing your resume…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    Analyze ATS Score
                  </span>
                )}
              </button>
            </div>
          )}

          {/* ── RESULTS ── */}
          {result && (
            <div className="space-y-5 stagger">

              {/* Row 1: Score + Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

                {/* Score card */}
                <Card className="md:col-span-2 flex flex-col items-center gap-5 py-8">
                  <div>
                    <SectionLabel>Overall Score</SectionLabel>
                    <h3 className="text-base font-semibold text-white leading-snug">ATS Compatibility</h3>
                  </div>
                  <ScoreGauge score={result.overall_score} label={result.score_label} />

                  <Divider />

                  <div className="w-full grid grid-cols-2 gap-3">
                    {[
                      { label: 'Words',       value: result.word_count },
                      { label: 'Readability', value: result.reading_ease },
                      { label: 'Level',       value: result.experience_level, cap: true },
                      { label: 'Pages',       value: result.resume_pages },
                    ].map(({ label, value, cap }) => (
                      <div key={label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-[10px] text-slate-500 font-code uppercase tracking-wider">{label}</p>
                        <p className={`text-sm font-semibold text-white mt-0.5 font-code ${cap ? 'capitalize' : ''}`}>{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Page verdict */}
                  <div
                    className="w-full rounded-xl px-3 py-2.5 text-xs font-medium text-center"
                    style={{
                      background: result.page_verdict?.startsWith('✅') ? 'rgba(110,231,183,0.07)' : 'rgba(251,191,36,0.07)',
                      border: `1px solid ${result.page_verdict?.startsWith('✅') ? 'rgba(110,231,183,0.2)' : 'rgba(251,191,36,0.2)'}`,
                      color: result.page_verdict?.startsWith('✅') ? '#6ee7b7' : '#fbbf24',
                    }}
                  >
                    {result.page_verdict}
                  </div>
                </Card>

                {/* Breakdown card */}
                <Card className="md:col-span-3">
                  <SectionLabel>Detailed Breakdown</SectionLabel>
                  <CardTitle>Score Breakdown</CardTitle>
                  <BreakdownBar breakdown={result.score_breakdown} />
                </Card>
              </div>

              {/* AI Suggestions */}
              {result.ai_suggestions && (
                <AISuggestions suggestions={result.ai_suggestions} />
              )}

              {/* Keywords */}
              <Card>
                <SectionLabel>Keyword Analysis</SectionLabel>
                <CardTitle>JD Keyword Match</CardTitle>
                <KeywordsPanel matched={result.matched_keywords} missing={result.missing_keywords} />
              </Card>

              {/* Sections + Format */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Card>
                  <SectionLabel>Structure Check</SectionLabel>
                  <CardTitle>Resume Sections</CardTitle>
                  <SectionsPanel sections={result.sections} />
                </Card>
                <Card>
                  <SectionLabel>ATS Compatibility</SectionLabel>
                  <CardTitle>Format Issues</CardTitle>
                  <FormatIssues issues={result.format_issues} />
                </Card>
              </div>

            </div>
          )}
        </main>

        {/* ── Footer ── */}
        <footer className="relative z-10 text-center py-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs text-slate-600">
            Built by{' '}
            <a
              href="https://github.com/Kush05Bhardwaj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300 transition-colors font-medium"
            >
              Kush Bhardwaj
            </a>
            {' '}· Open source · No data stored
          </p>
        </footer>

      </div>
    </div>
  )
}
