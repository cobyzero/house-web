import { API_BASE } from "./config"


interface ResponseBase<T> {
  data?: T;
  message: string;
  code: number;
}

export interface DataLoginResponse {
  id: number;
  name: string;
  username: string;
  password: string;
}

export interface House {
  id: number;
  name: string;
  temperature: number;
  alarmActive: boolean;
  userId: number;
}

export interface Room {
  id: number;
  name: string;
  house_id: number;
  temperature: number;
  light: boolean;
  ventilation: boolean;
}

export interface Device {
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
  ): Promise<ResponseBase<T>> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    const options: RequestInit = {
      method,
      headers,
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API Error: ${response.status}`)
    }

    return response.json()
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<ResponseBase<DataLoginResponse>> {
    return await this.request("auth/login", "POST", {
      username,
      password,
    })
  }

  async register(username: string, password: string, name: string): Promise<ResponseBase<unknown>> {
    return this.request("auth/register", "POST", {
      username,
      password,
      name,
    })
  }

  // House endpoints
  async findUserHouse(userId: number): Promise<ResponseBase<House>> {
    return this.request(`house/findUserHouse`, "POST", {
      userId,
    })
  }

  async createRoom(houseId: number, name: string): Promise<ResponseBase<Room>> {
    return this.request("house/createRoom", "POST", {
      houseId,
      name,
    })
  }

  async findDevicesByHouseId(houseId: number): Promise<ResponseBase<Device[]>> {
    return this.request("house/findDevicesByHouseId", "POST", {
      houseId,
    })
  }

  async findRoomsByHouseId(houseId: number): Promise<ResponseBase<Room[]>> {
    return this.request<Room[]>("house/findRoomsByHouseId", "POST", {
      houseId,
    })
  }

  async findDevicesByRoomId(roomId: number): Promise<ResponseBase<Device[]>> {
    return this.request("house/findDevicesByRoomId", "POST", {
      roomId,
    })
  }

  async createDevice(roomId: number, name: string, pinId: number): Promise<ResponseBase<Device>> {
    return this.request("house/createDevice", "POST", {
      roomId,
      name,
      pinId,
    })
  }

  // Device control endpoints
  async toggleLight(deviceId: number, light: boolean): Promise<ResponseBase<unknown>> {
    return this.request("house/lightDevice", "POST", {
      deviceId,
      light,
    })
  }

  async toggleVentilation(deviceId: number, ventilation: boolean): Promise<ResponseBase<unknown>> {
    return this.request("house/ventilationDevice", "POST", {
      deviceId,
      ventilation,
    })
  }

  async getTemperatureByRoom(roomId: number): Promise<ResponseBase<{ temperature: number }>> {
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
