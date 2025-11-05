const EXTERNAL_API_BASE = process.env.EXTERNAL_API_BASE || "https://house-api-azure.vercel.app/"
const PORT = process.env.PORT || 3001
const NODE_ENV = process.env.NODE_ENV || "development"

// List of allowed origins for CORS
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://localhost:3000",
  process.env.FRONTEND_URL || "",
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
].filter(Boolean)

export const config = {
  EXTERNAL_API_BASE,
  PORT,
  NODE_ENV,
  ALLOWED_ORIGINS,
}
