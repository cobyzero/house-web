"use client"

import { useState } from "react"
import Image from "next/image"
import { Power } from "lucide-react"

interface RoomCardProps {
  id: number
  name: string
  deviceCount: number
  image: string
}

export default function RoomCard({ name, deviceCount, image }: RoomCardProps) {
  const [isOn, setIsOn] = useState(true)

  return (
    <div className="glass-hover glass rounded-2xl overflow-hidden group cursor-pointer">
      {/* Image */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 smooth-transition"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 smooth-transition" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-sm">{name}</h3>
            <p className="text-xs text-muted-foreground">{deviceCount} dispositivos</p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsOn(!isOn)
            }}
            className={`p-2 rounded-lg smooth-transition ${isOn ? "text-accent bg-accent/10" : "text-muted-foreground opacity-60 bg-muted/20"}`}
          >
            <Power className="w-4 h-4" />
          </button>
        </div>

        {/* Status Badge */}
        <div
          className={`text-xs font-semibold px-2 py-1 rounded-lg w-fit ${
            isOn ? "bg-accent/20 text-accent" : "bg-muted/30 text-muted-foreground"
          }`}
        >
          {isOn ? "ENCENDIDO" : "APAGADO"}
        </div>
      </div>
    </div>
  )
}
