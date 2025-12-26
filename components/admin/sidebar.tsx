"use client"

import {
  BarChart3,
  GraduationCap,
  Users,
  Book,
  ClipboardList,
  SquareChartGantt,
  LogOut,
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

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        console.log("Logout successful");
        window.location.href = "/signin";
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading || !role) return null

  const visibleNavItems = navItems.filter((item) =>
    item.roles.includes(role)
  )

  console.log('subadmin navbar', visibleNavItems)

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
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
          <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-5 w-5 rotate-180" />
              Logout
            </button>
          </div>
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
