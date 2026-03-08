// src/components/SectionPanel.jsx
import React from 'react'

export default function SectionsPanel({ sections }) {
  const found    = sections.filter(s => s.found).length
  const total    = sections.length
  const pct      = Math.round((found / total) * 100)

  return (
    <div>
      {/* Progress summary */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-500">
          <span className="text-white font-semibold font-code">{found}/{total}</span> sections present
        </p>
        <span
          className="text-xs font-bold font-code px-2 py-0.5 rounded-md"
          style={{
            background: pct >= 80 ? 'rgba(110,231,183,0.1)' : pct >= 50 ? 'rgba(251,191,36,0.1)' : 'rgba(248,113,113,0.1)',
            color:      pct >= 80 ? '#6ee7b7'               : pct >= 50 ? '#fbbf24'               : '#f87171',
          }}
        >
          {pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full mb-5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: pct >= 80 ? 'linear-gradient(90deg,#6ee7b7cc,#6ee7b7)' : pct >= 50 ? 'linear-gradient(90deg,#fbbf24cc,#fbbf24)' : 'linear-gradient(90deg,#f87171cc,#f87171)',
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {sections.map((s, i) => (
          <div
            key={i}
            className="px-3 py-2.5 rounded-xl transition-all"
            style={{
              background: s.found ? 'rgba(110,231,183,0.05)' : 'rgba(248,113,113,0.05)',
              border: `1px solid ${s.found ? 'rgba(110,231,183,0.2)' : 'rgba(248,113,113,0.15)'}`,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs">{s.found ? 'âœ…' : 'âŒ'}</span>
              <span
                className="text-xs font-semibold"
                style={{ color: s.found ? '#6ee7b7' : '#f87171' }}
              >
                {s.name}
              </span>
            </div>
            {!s.found && s.tip && (
              <p className="text-[10px] text-slate-500 leading-relaxed mt-1.5 pl-5">{s.tip}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
