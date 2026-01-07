"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/app/context/admin"

export default function SubAdminDashboard() {
  const { role } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (role === "SUB_ADMIN") {
      router.replace("/subadmin/users")
    }
  }, [role, router])

  return null
}
