"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Zap, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (username === "admin" && password === "admin") {
      // Store session in localStorage
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("username", username)
      router.push("/")
    } else {
      setError("Credenciales inválidas. Usuario: admin, Contraseña: admin")
    }

    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-3xl gradient-hero flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Login Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl border border-white/10 dark:border-slate-800/50">
          <h1 className="text-3xl font-bold gradient-text text-center mb-2">Smart House</h1>
          <p className="text-muted-foreground text-center mb-8">Accede a tu hogar inteligente</p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-accent/50 smooth-transition"
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-accent/50 smooth-transition"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground smooth-transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl gradient-hero text-white font-semibold smooth-transition hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Credenciales de prueba:</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Usuario: <span className="font-mono">admin</span>
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Contraseña: <span className="font-mono">admin</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
