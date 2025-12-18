"use client"

import { createContext, useContext, useState } from "react"
import type { AdminTab } from "@/app/types/admin"

type AdminContextType = {
  activeTab: AdminTab
  setActiveTab: (tab: AdminTab) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const AdminContext = createContext<AdminContextType | null>(null)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <AdminContext.Provider
      value={{ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider")
  return ctx
}
