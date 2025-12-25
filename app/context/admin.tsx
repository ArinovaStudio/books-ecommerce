"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminTab } from "@/app/types/admin"

type Role = "ADMIN" | "SUB_ADMIN"

type User = {
  id: string
  name: string
  role: Role
  schoolId: string
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
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchAdminRole() {
      try {
        const res = await fetch("/api/admin/me")

        if (!res.ok) {
          // throw new Error("Not authenticated")
          router.push("/")
          return
        }

        const data = await res.json()

        if (data.user.role !== "ADMIN" && data.user.role !== "SUB_ADMIN") {
          throw new Error("Unauthorized")
        }

        setUser(data.user)
        setRole(data.user.role)

        setActiveTab(data.user.role === "SUB_ADMIN" ? "users" : "analytics")
      } catch (error) {
        console.error("Auth check failed", error)
        setUser(null)
        setRole(null)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    fetchAdminRole()
  }, [router])

  // Show nothing while checking
  if (loading) return null

  return (
    <AdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        sidebarOpen,
        setSidebarOpen,
        role: role!,
        user: user!,
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
