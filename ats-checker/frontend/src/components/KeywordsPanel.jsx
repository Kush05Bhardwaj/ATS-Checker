// src/components/KeywordsPanel.jsx
import React, { useState } from 'react'

export default function KeywordsPanel({ matched, missing }) {
  const [tab, setTab] = useState('matched')

  const tabs = [
    { id: 'matched', label: `Matched (${matched.length})`, color: '#6ee7b7' },
    { id: 'missing', label: `Missing (${missing.length})`, color: '#f87171' },
  ]

  const importanceColor = {
    high: '#f87171',
    medium: '#fbbf24',
    low: '#64748b',
  }

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-2 mb-4">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all"
            style={tab === t.id
              ? { background: `${t.color}20`, color: t.color, border: `1px solid ${t.color}50` }
              : { background: 'transparent', color: '#64748b', border: '1px solid #1e1e2e' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Matched keywords */}
      {tab === 'matched' && (
        <div className="flex flex-wrap gap-2">
          {matched.length === 0 && (
            <p className="text-slate-500 text-sm">No matched keywords found.</p>
          )}
          {matched.map((kw, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-md text-xs font-mono"
              style={{
                background: '#6ee7b718',
                color: '#6ee7b7',
                border: '1px solid #6ee7b730',
              }}
              title={`Importance: ${kw.importance} | Freq: ${kw.frequency}x`}
            >
              {kw.keyword}
              <span className="ml-1 opacity-50">×{kw.frequency}</span>
            </span>
          ))}
        </div>
      )}

      {/* Missing keywords */}
      {tab === 'missing' && (
        <div>
          {missing.length === 0 && (
            <p className="text-slate-500 text-sm">🎉 No critical missing keywords!</p>
          )}
          <div className="flex flex-wrap gap-2">
            {missing.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md text-xs font-mono"
                style={{
                  background: '#f8717118',
                  color: '#f87171',
                  border: '1px solid #f8717130',
                }}
              >
                {kw}
              </span>
            ))}
          </div>
          {missing.length > 0 && (
            <p className="text-slate-500 text-xs mt-3">
              💡 Try to naturally incorporate these terms from the job description into your resume.
            </p>
          )}
        </div>
      )}
    </div>
  )
}