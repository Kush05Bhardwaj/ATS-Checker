// src/components/KeywordsPanel.jsx
import React, { useState } from 'react'

export default function KeywordsPanel({ matched, missing }) {
  const [tab, setTab] = useState('matched')

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { id: 'matched', label: `Matched`,  count: matched.length, color: '#6ee7b7' },
          { id: 'missing', label: `Missing`,  count: missing.length, color: '#f87171' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150"
            style={tab === t.id
              ? { background: `${t.color}14`, color: t.color, border: `1px solid ${t.color}40` }
              : { background: 'transparent', color: '#64748b', border: '1px solid rgba(255,255,255,0.07)' }
            }
          >
            {t.label}
            <span
              className="px-1.5 py-0.5 rounded-md text-[10px] font-code font-bold"
              style={tab === t.id
                ? { background: `${t.color}20`, color: t.color }
                : { background: 'rgba(255,255,255,0.06)', color: '#64748b' }
              }
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Matched */}
      {tab === 'matched' && (
        <div>
          {matched.length === 0 ? (
            <p className="text-slate-500 text-sm py-4 text-center">No matched keywords found.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {matched.map((kw, i) => {
                const word = String(kw.keyword).replace(/\+/g, ' ')
                const freq = kw.frequency
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: 'rgba(110,231,183,0.08)',
                      color: '#6ee7b7',
                      border: '1px solid rgba(110,231,183,0.2)',
                    }}
                    title={`Importance: ${kw.importance} Â· ${freq}Ã— in resume`}
                  >
                    {word}
                    <span
                      className="font-code text-[10px] px-1 rounded"
                      style={{ background: 'rgba(110,231,183,0.15)', color: '#6ee7b7' }}
                    >
                      Ã—{freq}
                    </span>
                  </span>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Missing */}
      {tab === 'missing' && (
        <div>
          {missing.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2">
              <span className="text-3xl">ðŸŽ‰</span>
              <p className="text-slate-400 text-sm font-medium">All key terms are covered!</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {missing.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{
                      background: 'rgba(248,113,113,0.08)',
                      color: '#f87171',
                      border: '1px solid rgba(248,113,113,0.2)',
                    }}
                  >
                    {String(kw).replace(/\+/g, ' ')}
                  </span>
                ))}
              </div>
              <p className="text-slate-500 text-xs mt-4 leading-relaxed">
                ðŸ’¡ Naturally incorporate these terms from the job description into your resume for a higher score.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}


