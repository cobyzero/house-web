export const API_BASE = process.env.VERCEL_URL || "https://house-api-azure.vercel.app/"

// Ensure API_BASE ends with /
const normalizedApiBase = API_BASE.endsWith("/") ? API_BASE : `${API_BASE}/`
export const API_URL = normalizedApiBase
