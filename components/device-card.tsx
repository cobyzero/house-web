"use client"

import { useState } from "react"
import { Lightbulb, Wind, Tv, Feather as Washer, Speaker, Camera } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface DeviceCardProps {
  id: number
  name: string
  type: "light" | "ac" | "tv" | "washer" | "speaker" | "camera"
  state: boolean
  level?: number
}

const iconMap = {
  light: Lightbulb,
  ac: Wind,
  tv: Tv,
  washer: Washer,
  speaker: Speaker,
  camera: Camera,
}

const typeLabels = {
  light: "Luz",
  ac: "Aire",
  tv: "TV",
  washer: "Lavadora",
  speaker: "Speaker",
  camera: "Cámara",
}

export default function DeviceCard({ name, type, state: initialState, level = 0 }: DeviceCardProps) {
  const [isOn, setIsOn] = useState(initialState)
  const [deviceLevel, setDeviceLevel] = useState(level)
  const [showSchedule, setShowSchedule] = useState(false)

  const Icon = iconMap[type]
  const hasLevel = ["light", "ac", "speaker"].includes(type)

  return (
    <>
      <div className="glass-hover glass rounded-2xl p-4 smooth-transition">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div
              className={`p-3 rounded-lg ${isOn ? "bg-accent/20 text-accent" : "bg-muted/20 text-muted-foreground opacity-60"}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">{name}</h3>
              <p className="text-xs text-muted-foreground">{typeLabels[type]}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOn(!isOn)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full smooth-transition ${
              isOn ? "bg-accent" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white smooth-transition ${
                isOn ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Level Slider */}
        {hasLevel && isOn && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">
                {type === "light" ? "Brillo" : type === "speaker" ? "Volumen" : "Temperatura"}
              </label>
              <span className="text-xs font-semibold text-accent">{deviceLevel}%</span>
            </div>
            <Slider
              value={[deviceLevel]}
              onValueChange={(value) => setDeviceLevel(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        )}

        {/* Schedule Button */}
        <button
          onClick={() => setShowSchedule(true)}
          className="w-full py-2 text-xs font-semibold rounded-lg border border-border/50 hover:bg-muted/50 smooth-transition"
        >
          Programar
        </button>
      </div>

      {/* Schedule Modal (Mock) */}
      {showSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold mb-4">Programar {name}</h3>
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Hora de inicio</label>
                <input type="time" className="w-full px-3 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Hora de fin</label>
                <input type="time" className="w-full px-3 py-2 rounded-lg border border-border" />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSchedule(false)}
                className="flex-1 py-2 rounded-lg border border-border hover:bg-muted/50 smooth-transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowSchedule(false)}
                className="flex-1 py-2 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 smooth-transition"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
