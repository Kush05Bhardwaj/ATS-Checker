// src/components/SectionsPanel.jsx
import React from 'react'

export default function SectionsPanel({ sections }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {sections.map((s, i) => (
        <div
          key={i}
          className="p-3 rounded-xl border transition-all"
          style={{
            background: s.found ? '#6ee7b708' : '#f8717108',
            borderColor: s.found ? '#6ee7b730' : '#f8717130',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{s.found ? '✅' : '❌'}</span>
            <span
              className="text-xs font-semibold font-mono"
              style={{ color: s.found ? '#6ee7b7' : '#f87171' }}
            >
              {s.name}
            </span>
          </div>
          {!s.found && s.tip && (
            <p className="text-[10px] text-slate-500 leading-relaxed mt-1">{s.tip}</p>
          )}
        </div>
      ))}
    </div>
  )
}