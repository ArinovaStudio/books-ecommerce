"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Role = "ADMIN" | "SUB_ADMIN"

type User = {
  id: string
  name: string
  role: Role
  schoolId: string
}

interface AdminContextType {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  role: Role
  user: User
  schoolId: string
  loading: boolean
}

const AdminContext = createContext<AdminContextType | null>(null)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [role, setRole] = useState<Role | null>(null)
  const [schoolId, setSchoolId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchAdminRole() {
      try {
        const res = await fetch("/api/auth/me")

        if (!res.ok) {
          router.push("/")
          return
        }

        const data = await res.json()

        if (data.user.role !== "ADMIN" && data.user.role !== "SUB_ADMIN") {
          throw new Error("Unauthorized")
        }

        setUser(data.user)
        setSchoolId(data.user?.school?.id || "");
        setRole(data.user.role)
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
        sidebarOpen,
        setSidebarOpen,
        role: role!,
        user: user!,
        schoolId,
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
