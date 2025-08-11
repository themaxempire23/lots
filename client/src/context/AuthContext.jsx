import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const { user } = await api.me()
        if (active) setUser(user)
      } catch {
        // not logged in
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  async function login(email, password) {
    setError('')
    const { user } = await api.login({ email, password })
    setUser(user)
    return user
  }

  async function signup(email, password, name) {
    setError('')
    const { user } = await api.signup({ email, password, name })
    setUser(user)
    return user
  }

  async function logout() {
    await api.logout()
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, loading, error, setError, login, signup, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  return useContext(AuthCtx)
}
