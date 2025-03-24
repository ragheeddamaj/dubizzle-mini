"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  fullName: string
  email: string
  userType: "user" | "moderator"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        console.error("Failed to get current user:", error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Login failed")
    }

    setUser(data.user)
  }

  const register = async (userData: any) => {
    // We'll use this function to update the auth context after successful registration
    // The actual API call is now handled in the register page component
    if (userData) {
      try {
        // Refresh the current user data
        const response = await fetch("/api/auth/me")
        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        console.error("Failed to get current user after registration:", error)
      }
    }
  }

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    })
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

