"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { AdminTab } from "@/app/types/admin"

type Role = "ADMIN" | "SUBADMIN"

interface AdminContextType {
  activeTab: AdminTab
  setActiveTab: (tab: AdminTab) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  role: Role
  loading: boolean
}

const AdminContext = createContext<AdminContextType | null>(null)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [role, setRole] = useState<Role>("SUBADMIN") // default safe role
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAdminRole() {
      try {
        const res = await fetch("/api/test-admin-login", {
          credentials: "include",
        })
        const data = await res.json()
        console.log('====================================')
        console.log(data)
        console.log('====================================')

        if (data?.role === "admin" || data?.role === "subadmin") {
          setRole(data.role)
        }
      } catch (error) {
        console.error("Admin login check failed", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminRole()
  }, [])

  return (
    <AdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        sidebarOpen,
        setSidebarOpen,
        role,
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
