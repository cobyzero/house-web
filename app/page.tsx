"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Power, Zap, LogOut } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RoomCard from "@/components/room-card"
import DeviceCard from "@/components/device-card"

export default function Dashboard() {
  const router = useRouter()
  const [masterSwitch, setMasterSwitch] = useState(true)
  const [activeTab, setActiveTab] = useState("rooms")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const storedUsername = localStorage.getItem("username")

    if (!isAuthenticated) {
      router.push("/login")
    } else {
      setUsername(storedUsername || "Usuario")
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("username")
    router.push("/login")
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Zap className="w-12 h-12 text-accent mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </main>
    )
  }

  const rooms = [
    { id: 1, name: "Sala", deviceCount: 5, image: "/modern-living-room.png" },
    { id: 2, name: "Living Room", deviceCount: 4, image: "/cozy-living-area.jpg" },
    { id: 3, name: "Dining Room", deviceCount: 3, image: "/elegant-dining-room.png" },
    { id: 4, name: "Washing Room", deviceCount: 2, image: "/modern-laundry-room.jpg" },
  ]

  const devices = [
    { id: 1, name: "Luz Principal", type: "light", state: true, level: 85 },
    { id: 2, name: "Aire Acondicionado", type: "ac", state: true, level: 72 },
    { id: 3, name: "TV Smart", type: "tv", state: false, level: 0 },
    { id: 4, name: "Speaker", type: "speaker", state: true, level: 60 },
    { id: 5, name: "Cámara Seguridad", type: "camera", state: true, level: 0 },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 smooth-transition">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl gradient-hero flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Smart House</h1>
                <p className="text-xs text-muted-foreground">Hola, {username}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMasterSwitch(!masterSwitch)}
                className={`flex items-center gap-2 px-6 py-2 rounded-2xl font-semibold smooth-transition ${
                  masterSwitch ? "glass-hover text-accent" : "glass-hover text-muted-foreground opacity-60"
                }`}
              >
                <Power className="w-5 h-5" />
                {masterSwitch ? "Encendido" : "Apagado"}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl glass-hover text-muted-foreground hover:text-foreground smooth-transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-hover gradient-hero rounded-3xl p-8 text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-2">Mi Casa</h2>
          <p className="text-white/80 mb-6">Sala principal</p>
          <div className="flex items-end gap-8">
            <div>
              <p className="text-6xl font-bold">23°C</p>
              <p className="text-white/70 mt-2">Temperatura actual</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass w-full justify-start rounded-2xl p-1 mb-8">
            <TabsTrigger value="rooms" className="rounded-xl">
              Habitaciones
            </TabsTrigger>
            <TabsTrigger value="devices" className="rounded-xl">
              Dispositivos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {rooms.map((room) => (
                <Link key={room.id} href={`/room/${room.id}`}>
                  <RoomCard {...room} />
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {devices.map((device) => (
                <DeviceCard key={device.id} {...device} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}
