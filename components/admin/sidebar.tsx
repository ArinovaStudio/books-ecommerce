"use client"

import { BarChart3, GraduationCap, Users, Moon, Sun, Book, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { useAdmin } from "@/app/context/admin"
import { AdminTab } from "@/app/types/admin"

const navItems: {
  id: AdminTab
  label: string
  icon: any

}[] = [
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "schools", label: "Schools", icon: GraduationCap },
    { id: "bundels", label: "Bundels", icon: Book },
    { id: "orders", label: "Order", icon: ClipboardList }
  ]

export function AdminSidebar() {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen } = useAdmin()
  const { theme, setTheme } = useTheme()

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 border-b px-6 py-4 pb-[19.7px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/20">
              <BarChart3 className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Admin Panel
              </h1>
              <p className="text-xs text-muted-foreground">
                Dashboard
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
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
                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all cursor-pointer",
                    isActive
                      ? "bg-amber-400/20 text-amber-600 dark:text-amber-400"
                      : "text-foreground hover:bg-amber-400/10 hover:text-amber-600 dark:hover:text-amber-400",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive
                        ? "text-amber-500"
                        : "text-muted-foreground group-hover:text-amber-500",
                    )}
                  />
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
