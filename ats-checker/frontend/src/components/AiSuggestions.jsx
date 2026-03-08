// src/components/AISuggestions.jsx
import React from 'react'

export default function AISuggestions({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div
      className="rounded-2xl p-5 sm:p-6"
      style={{
        background: 'linear-gradient(135deg, rgba(56,189,248,0.06), rgba(110,231,183,0.04))',
        border: '1px solid rgba(56,189,248,0.2)',
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.25)' }}
        >
          {String.fromCodePoint(0x1F916)}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white leading-none">AI-Powered Suggestions</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Personalized improvements from Claude</p>
        </div>
      </div>

      <ol className="space-y-3">
        {suggestions.map((s, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span
              className="font-code text-[10px] font-bold flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
              style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}
            >
              {i + 1}
            </span>
            <p className="text-sm text-slate-300 leading-relaxed">{s}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}