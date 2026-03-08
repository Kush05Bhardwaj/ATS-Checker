// src/components/ScoreGauge.jsx
import React, { useEffect, useState } from 'react'

const RADIUS = 45
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function getColor(score) {
  if (score >= 80) return '#6ee7b7'   // green
  if (score >= 60) return '#38bdf8'   // blue
  if (score >= 40) return '#fbbf24'   // yellow
  return '#f87171'                    // red
}

function getLabel(label) {
  const map = {
    Excellent: '🔥 Excellent',
    Good: '✅ Good',
    Fair: '⚠️ Fair',
    Poor: '❌ Poor',
  }
  return map[label] || label
}

export default function ScoreGauge({ score, label }) {
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    let start = null
    const duration = 1200
    const animate = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setAnimated(Math.round(score * ease))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [score])

  const offset = CIRCUMFERENCE - (animated / 100) * CIRCUMFERENCE
  const color = getColor(score)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Track */}
          <circle
            cx="50" cy="50" r={RADIUS}
            fill="none"
            stroke="#1e1e2e"
            strokeWidth="8"
          />
          {/* Filled arc */}
          <circle
            cx="50" cy="50" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.05s linear', filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-bold text-3xl" style={{ color }}>
            {animated}
          </span>
          <span className="text-xs text-slate-500 font-mono">/100</span>
        </div>
      </div>
      <span
        className="text-sm font-semibold px-3 py-1 rounded-full font-mono"
        style={{ background: `${color}18`, color, border: `1px solid ${color}40` }}
      >
        {getLabel(label)}
      </span>
    </div>
  )
}