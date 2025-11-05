import axios, { type AxiosInstance } from "axios"
import { config } from "../config"

class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  async post<T>(endpoint: string, data: any, headers?: any): Promise<T> {
    try {
      const response = await this.client.post<T>(endpoint, data, { headers })
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500
      const message = error.response?.data?.message || error.message
      console.error(`[API Error] Status: ${status}, Message: ${message}`)
      throw {
        status,
        message: message || "External API error",
        data: error.response?.data,
      }
    }
    throw error
  }
}

export const externalApiClient = new ApiClient(config.EXTERNAL_API_BASE)
