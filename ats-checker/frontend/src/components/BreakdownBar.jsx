// src/components/BreakdownBar.jsx
import React from 'react'

const META = {
  keyword_match:        { label: 'Keyword Match',    weight: 40, icon: '🔑' },
  section_completeness: { label: 'Section Coverage', weight: 20, icon: '📋' },
  format_compatibility: { label: 'Format Score',     weight: 20, icon: '🎨' },
  keyword_density:      { label: 'Keyword Density',  weight: 10, icon: '📊' },
  action_verbs:         { label: 'Action Verbs',     weight: 10, icon: '⚡' },
}

function getColor(v) {
  if (v >= 80) return '#6ee7b7'
  if (v >= 60) return '#38bdf8'
  if (v >= 40) return '#fbbf24'
  return '#f87171'
}

export default function BreakdownBar({ breakdown }) {
  return (
    <div className="space-y-4">
      {Object.entries(breakdown).map(([key, value]) => {
        const color = getColor(value)
        const { label, weight, icon } = META[key] || { label: key, weight: '?', icon: '•' }
        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">{icon}</span>
                <span className="text-sm text-slate-300 font-medium">{label}</span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-md font-code"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}
                >
                  {weight}%
                </span>
              </div>
              <span className="font-code text-sm font-bold" style={{ color }}>
                {value.toFixed(0)}
                <span className="text-slate-600 font-normal">%</span>
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${value}%`,
                  background: `linear-gradient(90deg, ${color}cc, ${color})`,
                  boxShadow: `0 0 10px ${color}50`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
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
            <div className="flex flex-wrap justify-between items-center mb-1 gap-1">
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