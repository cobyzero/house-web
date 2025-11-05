import express from "express"
import { config } from "./config"
import { corsMiddleware } from "./middleware/cors"
import authRoutes from "./routes/auth"
import houseRoutes from "./routes/house"

const app = express()

// Middleware
app.use(corsMiddleware)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  })
})

// API Routes
app.use("/auth", authRoutes)
app.use("/house", houseRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.path,
  })
})

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[Error]", err)
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  })
})

// Start server
const PORT = config.PORT
app.listen(PORT, () => {
  console.log(`🚀 House API Backend running on port ${PORT}`)
  console.log(`Environment: ${config.NODE_ENV}`)
  console.log(`External API: ${config.EXTERNAL_API_BASE}`)
  console.log(`Allowed origins: ${config.ALLOWED_ORIGINS.join(", ")}`)
})
