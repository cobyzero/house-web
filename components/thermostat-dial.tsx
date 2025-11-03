"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

interface ThermostatDialProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
}

export default function ThermostatDial({ value, min = 10, max = 30, onChange }: ThermostatDialProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dialRef = useRef<HTMLDivElement>(null)

  const rotation = ((value - min) / (max - min)) * 360
  const percentage = ((value - min) / (max - min)) * 100

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!dialRef.current) return

      const rect = dialRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      let angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90
      if (angle < 0) angle += 360

      const newValue = min + (angle / 360) * (max - min)
      onChange(Math.max(min, Math.min(max, Math.round(newValue))))
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [isDragging, min, max, onChange])

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        ref={dialRef}
        className="relative w-48 h-48 rounded-full glass soft-shadow cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDragging(false)}
      >
        {/* Background circle */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          {/* Tick marks */}
          {Array.from({ length: 21 }).map((_, i) => {
            const angle = (i / 20) * 360
            const isMainTick = i % 5 === 0
            const rad = (angle * Math.PI) / 180
            const x1 = 100 + 85 * Math.cos(rad - Math.PI / 2)
            const y1 = 100 + 85 * Math.sin(rad - Math.PI / 2)
            const x2 = 100 + (isMainTick ? 75 : 82) * Math.cos(rad - Math.PI / 2)
            const y2 = 100 + (isMainTick ? 75 : 82) * Math.sin(rad - Math.PI / 2)
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth={isMainTick ? 2 : 1}
                opacity="0.3"
              />
            )
          })}

          {/* Progress arc */}
          <circle
            cx="100"
            cy="100"
            r="75"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="6"
            strokeDasharray={`${(percentage / 100) * (2 * Math.PI * 75)} ${2 * Math.PI * 75}`}
            opacity="0.6"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(139, 92, 246)" />
              <stop offset="100%" stopColor="rgb(236, 72, 153)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold gradient-text">{value}°</span>
          <span className="text-xs text-muted-foreground mt-2">Celsius</span>
        </div>

        {/* Pointer */}
        <div
          className="absolute w-1 h-12 bg-accent rounded-full top-4 left-1/2 -translate-x-1/2 origin-bottom smooth-transition pointer-events-none"
          style={{
            transform: `translateX(-50%) rotate(${rotation}deg)`,
            filter: "drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))",
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button onClick={() => onChange(Math.max(min, value - 1))} className="p-3 rounded-lg glass-hover glass">
          <ChevronDown className="w-5 h-5" />
        </button>
        <button onClick={() => onChange(Math.min(max, value + 1))} className="p-3 rounded-lg glass-hover glass">
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
