"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ChevronLeft, Lightbulb } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import ThermostatDial from "@/components/thermostat-dial"
import IntensitySlider from "@/components/intensity-slider"
import SceneChip from "@/components/scene-chip"
import DeviceCard from "@/components/device-card"
import { apiService } from "@/lib/api-service"

interface Device {
  id: number
  name: string
  type: "light" | "ventilation" | "temperature" | "other"
  state?: boolean
  roomId: number
}

export default function RoomDetail() {
  const params = useParams()
  const roomId = params.id as string
  const { toast } = useToast()
  const [temperature, setTemperature] = useState(23)
  const [lightIntensity, setLightIntensity] = useState(85)
  const [lightOn, setLightOn] = useState(true)
  const [selectedScene, setSelectedScene] = useState<string | null>(null)
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const roomNames: Record<string, string> = {
    "1": "Sala",
    "2": "Dormitorio",
    "3": "Cocina",
    "4": "Baño",
  }

  useEffect(() => {
    const fetchRoomDevices = async () => {
      try {
        const response = await apiService.findDevicesByRoomId(Number.parseInt(roomId))
        if (response.data) {
          setDevices(response.data)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar dispositivos"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoomDevices()
  }, [roomId, toast])

  const scenes = ["Pronto", "Modo noche", "Lectura", "Relajación"]

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <p className="text-muted-foreground">Cargando cuarto...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 smooth-transition">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-lg glass-hover glass">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{roomNames[roomId] || "Habitación"}</h1>
            </div>
            <Select defaultValue={roomId}>
              <SelectTrigger className="w-40 glass rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass rounded-xl">
                <SelectItem value="1">Sala</SelectItem>
                <SelectItem value="2">Dormitorio</SelectItem>
                <SelectItem value="3">Cocina</SelectItem>
                <SelectItem value="4">Baño</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Thermostat */}
          <div className="lg:col-span-1 flex justify-center">
            <div>
              <h2 className="text-lg font-bold mb-4 text-center">Temperatura</h2>
              <ThermostatDial value={temperature} onChange={setTemperature} />
            </div>
          </div>

          {/* Middle Column - Controls */}
          <div className="lg:col-span-1 space-y-4">
            <div>
              <h2 className="text-lg font-bold mb-4">Iluminación</h2>
              <div className="glass rounded-xl p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-lg ${lightOn ? "bg-accent/20 text-accent" : "bg-muted/20 text-muted-foreground"}`}
                    >
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <span className="font-semibold">Luces</span>
                  </div>
                  <button
                    onClick={() => setLightOn(!lightOn)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full smooth-transition ${
                      lightOn ? "bg-accent" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white smooth-transition ${
                        lightOn ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
              {lightOn && <IntensitySlider label="Brillo" value={lightIntensity} onChange={setLightIntensity} />}
            </div>

            <div>
              <h2 className="text-lg font-bold mb-4">Escenas Rápidas</h2>
              <div className="flex flex-wrap gap-2">
                {scenes.map((scene) => (
                  <SceneChip
                    key={scene}
                    label={scene}
                    selected={selectedScene === scene}
                    onClick={() => setSelectedScene(scene)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Devices List */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold mb-4">Dispositivos</h2>
            {devices.length > 0 ? (
              <div className="space-y-3">
                {devices.map((device) => (
                  <DeviceCard
                    key={device.id}
                    id={device.id}
                    name={device.name}
                    type={device.type === "light" ? "light" : device.type === "ventilation" ? "ac" : "tv"}
                    state={device.state || false}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No hay dispositivos en este cuarto</p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
