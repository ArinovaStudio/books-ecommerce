"use client"

import {
  BarChart3,
  GraduationCap,
  Users,
  Book,
  ClipboardList,
  SquareChartGantt,
  LucideDoorOpen,
  LucideLogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAdmin } from "@/app/context/admin"
import { AdminTab } from "@/app/types/admin"

type Role = "ADMIN" | "SUB_ADMIN"

const navItems: {
  id: AdminTab
  label: string
  icon: any
  roles: Role[]
}[] = [
    { id: "analytics", label: "Analytics", icon: BarChart3, roles: ["ADMIN"] },
    { id: "users", label: "Users", icon: Users, roles: ["ADMIN", "SUB_ADMIN"] },
    { id: "schools", label: "Schools", icon: GraduationCap, roles: ["ADMIN"] },
    // { id: "bundels", label: "Bundels", icon: Book, roles: ["ADMIN", "SUB_ADMIN"] },
    { id: "orders", label: "Orders", icon: ClipboardList, roles: ["ADMIN", "SUB_ADMIN"] },
    // { id: "products", label: "Products", icon: SquareChartGantt, roles: ["ADMIN", "SUB_ADMIN"] },
  ]

export function AdminSidebar() {
  const {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    role,
    loading,
  } = useAdmin()

  if (loading || !role) return null

  const visibleNavItems = navItems.filter((item) =>
    item.roles.includes(role)
  )

    const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        console.log("Logout successful");
        window.location.href = "/logout";
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col relative">
          <div onClick={() => handleLogout()} className="absolute w-5/6 h-fit bottom-4 left-5 bg-red-500/10 text-red-400 gap-2 flex justify-center items-center py-3 rounded-lg">
          <LucideLogOut className="rotate-180" size={18} /> Logout
          </div>
          {/* Header */}
          <div className="flex items-center gap-3 border-b px-6 py-[18px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/20">
              <BarChart3 className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">{role === "ADMIN" ? "Admin" : "Sub Admin"}</h1>
              <p className="text-xs text-muted-foreground">
                {role === "ADMIN" ? "Administrator" : "Sub Admin"}
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 p-4">
            {visibleNavItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-amber-400/20 text-amber-600"
                      : "hover:bg-amber-400/10"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}
