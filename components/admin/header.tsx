"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdmin } from "@/app/context/admin"

export function AdminHeader() {
  const { activeTab, setSidebarOpen } = useAdmin()

  const titleMap = {
    analytics: "Analytics",
    users: "Users",
    schools: "Schools",
  }

  const descriptionMap = {
    analytics: "View comprehensive analytics and insights",
    users: "Manage all registered users",
    schools: "View and manage all schools",
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card">
      <div className="flex items-center justify-between px-4 py-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {titleMap[activeTab]}
            </h2>
            <p className="text-sm text-muted-foreground">
              {descriptionMap[activeTab]}
            </p>
          </div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
          AD
        </div>
      </div>
    </header>
  )
}
