"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminProvider } from "@/app/context/admin"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("analytics")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <AdminProvider>


      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Content wrapper */}
        <div className="flex flex-1 flex-col lg:ml-64">
          {children}
        </div>
      </div>
    </AdminProvider>
  )
}
