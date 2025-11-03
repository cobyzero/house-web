"use client"

import { Slider } from "@/components/ui/slider"

interface IntensitySliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export default function IntensitySlider({ label, value, onChange, min = 0, max = 100 }: IntensitySliderProps) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <label className="font-semibold text-sm">{label}</label>
        <span className="text-sm font-bold text-accent">{value}%</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={1}
        className="w-full"
      />
    </div>
  )
}
