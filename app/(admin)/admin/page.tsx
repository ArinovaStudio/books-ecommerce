"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/app/context/admin"

export default function AdminDashboard() {
  const { role } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (role === "ADMIN") {
      router.replace("/admin/analytics")
    } else if (role === "SUB_ADMIN") {
      router.replace("/admin/users")
    }
  }, [role, router])

  return null
}
