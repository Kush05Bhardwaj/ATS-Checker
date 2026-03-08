// src/components/FormatIssues.jsx
import React from 'react'

const severityConfig = {
  critical: { icon: '🔴', color: '#f87171', bg: '#f8717112' },
  warning:  { icon: '🟡', color: '#fbbf24', bg: '#fbbf2412' },
  info:     { icon: '🔵', color: '#38bdf8', bg: '#38bdf812' },
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