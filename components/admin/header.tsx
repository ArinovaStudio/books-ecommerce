"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdmin } from "@/app/context/admin"
import { usePathname } from "next/navigation"

export function AdminHeader() {
  const { setSidebarOpen } = useAdmin()
  const pathname = usePathname()

  const getPageInfo = (pathname: string) => {
    if (pathname.includes('/analytics')) {
      return {
        title: 'Analytics',
        description: 'View comprehensive analytics and insights'
      }
    }
    if (pathname.includes('/users')) {
      return {
        title: 'Users',
        description: 'Manage all registered users'
      }
    }
    if (pathname.includes('/schools')) {
      return {
        title: 'Schools',
        description: 'View and manage all schools'
      }
    }
    if (pathname.includes('/orders')) {
      return {
        title: 'Orders',
        description: 'View and manage all orders'
      }
    }
    return {
      title: 'Admin',
      description: 'Admin Dashboard'
    }
  }

  const { title, description } = getPageInfo(pathname)

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
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {description}
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
