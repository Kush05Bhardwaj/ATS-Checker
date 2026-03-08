// src/components/ScoreGauge.jsx
import React, { useEffect, useState } from 'react'

const RADIUS = 46
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function getColor(score) {
  if (score >= 80) return '#6ee7b7'
  if (score >= 60) return '#38bdf8'
  if (score >= 40) return '#fbbf24'
  return '#f87171'
}

const LABEL_MAP = {
  Excellent: { icon: String.fromCodePoint(0x1F525), text: 'Excellent' },
  Good:      { icon: '\u2705',  text: 'Good'      },
  Fair:      { icon: '\u26A0\uFE0F', text: 'Fair' },
  Poor:      { icon: '\u274C',  text: 'Poor'      },
}

export default function ScoreGauge({ score, label }) {
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    let start = null
    const duration = 1400
    const animate = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 4)
      setAnimated(Math.round(score * ease))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [score])

  const offset = CIRCUMFERENCE - (animated / 100) * CIRCUMFERENCE
  const color  = getColor(score)
  const meta   = LABEL_MAP[label] || { icon: '', text: label }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: 180, height: 180, flexShrink: 0 }}>
        <svg width="180" height="180" className="-rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
          <circle
            cx="50" cy="50" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.04s linear', filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="font-code font-bold leading-none" style={{ fontSize: 38, color }}>
            {animated}
          </span>
          <span className="text-[11px] text-slate-500 font-code">/100</span>
        </div>
      </div>

      <div
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold"
        style={{ background: `${color}14`, border: `1px solid ${color}40`, color }}
      >
        <span>{meta.icon}</span>
        <span>{meta.text}</span>
      </div>
    </div>
  )
}