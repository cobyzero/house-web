export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/"

// Ensure API_BASE ends with /
const normalizedApiBase = API_BASE.endsWith("/") ? API_BASE : `${API_BASE}/`
export const API_URL = normalizedApiBase
