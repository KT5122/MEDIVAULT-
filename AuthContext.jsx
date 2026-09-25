"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem("token"))

  // Configure axios defaults
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
  axios.defaults.baseURL = API_BASE_URL

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/profile")
      setUser(response.data.user)
    } catch (error) {
      console.error("Failed to fetch profile:", error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post("/login", { email, password })
      const { access_token, user } = response.data

      localStorage.setItem("token", access_token)
      setToken(access_token)
      setUser(user)
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`

      return { success: true, user }
    } catch (error) {
      const message = error.response?.data?.error || "Login failed"
      return { success: false, error: message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post("/register", userData)
      const { access_token, user } = response.data

      localStorage.setItem("token", access_token)
      setToken(access_token)
      setUser(user)
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`

      return { success: true, user }
    } catch (error) {
      const message = error.response?.data?.error || "Registration failed"
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common["Authorization"]
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
