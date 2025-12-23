"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { AdminTab } from "@/app/types/admin"

type Role = "ADMIN" | "SUB_ADMIN"

type User = {
  id: string
  name: string
  role: Role
  school: {
    id: string
    name: string
  } | null
}

interface AdminContextType {
  activeTab: AdminTab
  setActiveTab: (tab: AdminTab) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  role: Role
  user: User
  loading: boolean
}

const AdminContext = createContext<AdminContextType | null>(null)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics")
  const [user, setUser] = useState<User>()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAdminRole() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        })

        if (!res.ok) throw new Error("Not authenticated")

        const data = await res.json()
        setUser(data.user)
        setRole(data.user.role)

        if (data.user.role === "SUB_ADMIN") {
          setActiveTab("users")
        } else {
          setActiveTab("analytics")
        }

      } catch (error) {
        console.error("Auth check failed", error)
        setRole(null)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminRole()
  }, [])

  if (loading || !role) return null

  return (
    <AdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        sidebarOpen,
        setSidebarOpen,
        role,
        user,
        loading,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}


export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used inside AdminProvider")
  }
  return context
}
