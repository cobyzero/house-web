"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Power, Zap, LogOut, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import RoomCard from "@/components/room-card"
import DeviceCard from "@/components/device-card"
import { apiService } from "@/lib/api-service"

interface House {
  id: number
  name: string
}

interface Room {
  id: number
  name: string
  houseId: number
}

interface Device {
  id: number
  name: string
  type: "light" | "ventilation" | "temperature" | "other"
  state?: boolean
}

export default function Dashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [masterSwitch, setMasterSwitch] = useState(true)
  const [activeTab, setActiveTab] = useState("rooms")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [house, setHouse] = useState<House | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState("")

  useEffect(() => {
    const initDashboard = async () => {
      const isAuthenticated = localStorage.getItem("isAuthenticated")
      const storedUsername = localStorage.getItem("username")
      const userId = localStorage.getItem("userId")

      if (!isAuthenticated || !userId) {
        router.push("/login")
        return
      }

      setUsername(storedUsername || "Usuario")

      try {
        // Fetch user's house
        const houseResponse = await apiService.findUserHouse(Number.parseInt(userId))
        if (houseResponse.data) {
          setHouse(houseResponse.data)

          // Fetch devices by house
          const devicesResponse = await apiService.findDevicesByHouseId(houseResponse.data.id)
          if (devicesResponse.data) {
            setDevices(devicesResponse.data)
          }

          // TODO: Fetch rooms when endpoint is available
          // For now using mock rooms structure
          setRooms([
            { id: 1, name: "Sala", houseId: houseResponse.data.id },
            { id: 2, name: "Dormitorio", houseId: houseResponse.data.id },
            { id: 3, name: "Cocina", houseId: houseResponse.data.id },
          ])
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar datos"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    initDashboard()
  }, [router, toast])

  const handleCreateRoom = async () => {
    if (!newRoomName.trim() || !house) return

    setIsCreatingRoom(true)
    try {
      const response = await apiService.createRoom(house.id, newRoomName)
      if (response.data) {
        setRooms([...rooms, response.data])
        setNewRoomName("")
        toast({
          title: "Éxito",
          description: `Cuarto "${newRoomName}" creado`,
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear cuarto"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsCreatingRoom(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("username")
    localStorage.removeItem("userId")
    localStorage.removeItem("authToken")
    apiService.clearToken()
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
          <h2 className="text-3xl font-bold mb-2">{house?.name || "Mi Casa"}</h2>
          <p className="text-white/80 mb-6">Gestiona tus dispositivos inteligentes</p>
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
            {/* Create Room Section */}
            <div className="glass rounded-2xl p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Agregar Cuarto
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Nombre del cuarto"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  disabled={isCreatingRoom}
                />
                <button
                  onClick={handleCreateRoom}
                  disabled={isCreatingRoom || !newRoomName.trim()}
                  className="px-6 py-2 rounded-lg gradient-hero text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingRoom ? "Creando..." : "Crear"}
                </button>
              </div>
            </div>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <Link key={room.id} href={`/room/${room.id}`}>
                    <RoomCard
                      id={room.id}
                      name={room.name}
                      deviceCount={devices.filter((d) => d.roomId === room.id).length}
                      image="/placeholder.svg"
                    />
                  </Link>
                ))
              ) : (
                <p className="text-muted-foreground col-span-full text-center py-8">No hay cuartos disponibles</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {devices.length > 0 ? (
                devices.map((device) => (
                  <DeviceCard
                    key={device.id}
                    id={device.id}
                    name={device.name}
                    type={device.type === "light" ? "light" : device.type === "ventilation" ? "washer" : "tv"}
                    state={device.state || false}
                  />
                ))
              ) : (
                <p className="text-muted-foreground col-span-full text-center py-8">No hay dispositivos disponibles</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}
