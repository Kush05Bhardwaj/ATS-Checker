// src/components/AISuggestions.jsx
import React from 'react'

export default function AISuggestions({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="rounded-2xl border p-5 space-y-3"
      style={{ borderColor: '#38bdf830', background: '#38bdf808' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🤖</span>
        <h3 className="font-mono font-bold text-sm text-accent2">
          AI-Powered Suggestions
        </h3>
      </div>
      <ol className="space-y-2.5">
        {suggestions.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="font-mono text-xs font-bold mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: '#38bdf820', color: '#38bdf8' }}
            >
              {i + 1}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{s}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}