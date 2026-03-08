// src/components/FormatIssues.jsx
import React from 'react'

const SEV = {
  critical: { label: 'Critical', color: '#f87171', bg: 'rgba(248,113,113,0.07)', border: 'rgba(248,113,113,0.2)',  dot: '#f87171' },
  warning:  { label: 'Warning',  color: '#fbbf24', bg: 'rgba(251,191,36,0.07)',  border: 'rgba(251,191,36,0.2)',   dot: '#fbbf24' },
  info:     { label: 'Info',     color: '#38bdf8', bg: 'rgba(56,189,248,0.07)',  border: 'rgba(56,189,248,0.2)',   dot: '#38bdf8' },
}
const ORDER = { critical: 0, warning: 1, info: 2 }

export default function FormatIssues({ issues }) {
  if (!issues || issues.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 gap-2">
        <span className="text-3xl">✅</span>
        <p className="text-slate-400 text-sm font-medium">No format issues detected</p>
        <p className="text-slate-600 text-xs">Your resume is ATS-format safe</p>
      </div>
    )
  }

  const sorted = [...issues].sort((a, b) => (ORDER[a.severity] ?? 3) - (ORDER[b.severity] ?? 3))

  return (
    <div className="space-y-2.5">
      {sorted.map((issue, i) => {
        const cfg = SEV[issue.severity] || SEV.info
        return (
          <div
            key={i}
            className="rounded-xl p-3.5"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
          >
            <div className="flex items-start gap-3">
              <span
                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                style={{ background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}` }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-semibold" style={{ color: cfg.color }}>
                    {issue.issue}
                  </p>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-code font-bold uppercase tracking-wider"
                    style={{ background: `${cfg.color}20`, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{issue.fix}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}


export default function FormatIssues({ issues }) {
  if (!issues || issues.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        ✅ No major format issues detected.
      </div>
    )
  }

  const sorted = [...issues].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 }
    return order[a.severity] - order[b.severity]
  })

  return (
    <div className="space-y-3">
      {sorted.map((issue, i) => {
        const cfg = severityConfig[issue.severity] || severityConfig.info
        return (
          <div
            key={i}
            className="rounded-xl p-3 border"
            style={{ background: cfg.bg, borderColor: `${cfg.color}30` }}
          >
            <div className="flex items-start gap-2">
              <span className="text-sm mt-0.5">{cfg.icon}</span>
              <div>
                <p className="text-xs font-semibold" style={{ color: cfg.color }}>
                  {issue.issue}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {issue.fix}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}