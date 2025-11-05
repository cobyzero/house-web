import { Router, type Request, type Response } from "express"
import { externalApiClient } from "../utils/api-client"

const router = Router()

// POST /auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      })
    }

    const result = await externalApiClient.post("/auth/login", {
      username,
      password,
    })

    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error("[Auth] Login error:", error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Login failed",
    })
  }
})

// POST /auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password, name } = req.body

    if (!username || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Username, password, and name are required",
      })
    }

    const result = await externalApiClient.post("/auth/register", {
      username,
      password,
      name,
    })

    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error("[Auth] Register error:", error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Registration failed",
    })
  }
})

export default router
