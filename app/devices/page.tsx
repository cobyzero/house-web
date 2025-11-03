"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import DeviceCard from "@/components/device-card"

const allDevices = [
  { id: 1, name: "Luz Principal Sala", type: "light" as const, state: true, level: 85 },
  { id: 2, name: "Luz Cocina", type: "light" as const, state: true, level: 60 },
  { id: 3, name: "Luz Dormitorio", type: "light" as const, state: false, level: 0 },
  { id: 4, name: "Aire Sala", type: "ac" as const, state: true, level: 72 },
  { id: 5, name: "Aire Dormitorio", type: "ac" as const, state: false, level: 0 },
  { id: 6, name: "TV Sala", type: "tv" as const, state: true, level: 0 },
  { id: 7, name: "TV Dormitorio", type: "tv" as const, state: false, level: 0 },
  { id: 8, name: "Lavadora", type: "washer" as const, state: false, level: 0 },
  { id: 9, name: "Speaker Sala", type: "speaker" as const, state: true, level: 45 },
  { id: 10, name: "Speaker Cocina", type: "speaker" as const, state: false, level: 0 },
  { id: 11, name: "Cámara Entrada", type: "camera" as const, state: true, level: 0 },
  { id: 12, name: "Cámara Patio", type: "camera" as const, state: true, level: 0 },
]

const deviceTypes = [
  { value: "all", label: "Todos" },
  { value: "light", label: "Luz" },
  { value: "ac", label: "Aire" },
  { value: "tv", label: "TV" },
  { value: "washer", label: "Lavadora" },
  { value: "speaker", label: "Speaker" },
  { value: "camera", label: "Cámara" },
]

export default function DevicesPage() {
  const [selectedType, setSelectedType] = useState("all")

  const filteredDevices = selectedType === "all" ? allDevices : allDevices.filter((d) => d.type === selectedType)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 smooth-transition">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-lg glass-hover glass">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">Dispositivos</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Filtrar por tipo</h3>
          <div className="flex flex-wrap gap-2">
            {deviceTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm smooth-transition ${
                  selectedType === type.value
                    ? "glass-hover gradient-text border border-accent bg-accent/10"
                    : "glass-hover border border-border hover:border-accent/50"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDevices.map((device) => (
            <DeviceCard key={device.id} {...device} />
          ))}
        </div>
      </section>
    </main>
  )
}
