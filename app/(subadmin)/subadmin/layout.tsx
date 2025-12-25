"use client"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminProvider, useAdmin } from "@/app/context/admin"
import { Toaster } from "@/components/ui/toaster"

function SubAdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { role, activeTab, setActiveTab, sidebarOpen, setSidebarOpen, loading } = useAdmin()

    if (loading) return <div>Loading...</div>

    if (role !== "SUB_ADMIN") {
        return;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="flex flex-1 flex-col lg:ml-64">
                {children}
            </div>
        </div>
    )
}

export default function SubAdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminProvider>
            <SubAdminLayoutContent>{children}</SubAdminLayoutContent>
            <Toaster />
        </AdminProvider>
    )
}
