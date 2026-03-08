// src/components/BreakdownBar.jsx
import React from 'react'

const LABELS = {
  keyword_match: 'Keyword Match',
  section_completeness: 'Section Coverage',
  format_compatibility: 'Format Score',
  keyword_density: 'Keyword Density',
  action_verbs: 'Action Verbs',
}

const WEIGHTS = {
  keyword_match: 40,
  section_completeness: 20,
  format_compatibility: 20,
  keyword_density: 10,
  action_verbs: 10,
}

function getBarColor(score) {
  if (score >= 80) return '#6ee7b7'
  if (score >= 60) return '#38bdf8'
  if (score >= 40) return '#fbbf24'
  return '#f87171'
}

export default function BreakdownBar({ breakdown }) {
  return (
    <div className="space-y-3">
      {Object.entries(breakdown).map(([key, value]) => {
        const color = getBarColor(value)
        return (
          <div key={key}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-400 font-sans">
                {LABELS[key]}
                <span className="text-slate-600 ml-1 font-mono text-[10px]">
                  ({WEIGHTS[key]}% weight)
                </span>
              </span>
              <span className="font-mono text-xs font-semibold" style={{ color }}>
                {value.toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 bg-[#1e1e2e] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${value}%`,
                  background: color,
                  boxShadow: `0 0 8px ${color}60`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}