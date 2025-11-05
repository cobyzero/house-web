import { API_BASE, API_URL } from "./config"

interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

interface LoginResponse {
    data:    DataLoginResponse | null;
    message: string;
    code:    number;
}

interface DataLoginResponse {
    id:       number;
    name:     string;
    username: string;
    password: string;
}

interface House {
  id: number
  name: string
  userId: number
}

interface Room {
  id: number
  name: string
  houseId: number
}

interface Device {
  id: number
  name: string
  roomId: number
  type: "light" | "ventilation" | "temperature" | "other"
  state?: boolean
  pinId?: number
}

class ApiService {
  private token: string | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("authToken")
    }
  }

  private async request<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: unknown,
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    const options: RequestInit = {
      method,
      headers,
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(`${API_URL}${endpoint}`, options)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API Error: ${response.status}`)
    }

    return response.json()
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })
      const data : LoginResponse = await response.json()
      return data
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      throw error
    }
  }

  async register(username: string, password: string, name: string): Promise<ApiResponse<unknown>> {
    return this.request("auth/register", "POST", {
      username,
      password,
      name,
    })
  }

  // House endpoints
  async findUserHouse(userId: number): Promise<ApiResponse<House>> {
    return this.request(`house/findUserHouse`, "POST", {
      userId,
    })
  }

  async createRoom(houseId: number, name: string): Promise<ApiResponse<Room>> {
    return this.request("house/createRoom", "POST", {
      houseId,
      name,
    })
  }

  async findDevicesByHouseId(houseId: number): Promise<ApiResponse<Device[]>> {
    return this.request("house/findDevicesByHouseId", "POST", {
      houseId,
    })
  }

  async findDevicesByRoomId(roomId: number): Promise<ApiResponse<Device[]>> {
    return this.request("house/findDevicesByRoomId", "POST", {
      roomId,
    })
  }

  async createDevice(roomId: number, name: string, pinId: number): Promise<ApiResponse<Device>> {
    return this.request("house/createDevice", "POST", {
      roomId,
      name,
      pinId,
    })
  }

  // Device control endpoints
  async toggleLight(deviceId: number, light: boolean): Promise<ApiResponse<unknown>> {
    return this.request("house/lightDevice", "POST", {
      deviceId,
      light,
    })
  }

  async toggleVentilation(deviceId: number, ventilation: boolean): Promise<ApiResponse<unknown>> {
    return this.request("house/ventilationDevice", "POST", {
      deviceId,
      ventilation,
    })
  }

  async getTemperatureByRoom(roomId: number): Promise<ApiResponse<{ temperature: number }>> {
    return this.request("house/temperatureByRoomId", "POST", {
      roomId,
    })
  }

  setToken(token: string): void {
    this.token = token
    localStorage.setItem("authToken", token)
  }

  clearToken(): void {
    this.token = null
    localStorage.removeItem("authToken")
  }
}

export const apiService = new ApiService()
