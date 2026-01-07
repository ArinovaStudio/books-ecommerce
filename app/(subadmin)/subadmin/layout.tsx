"use client"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { AdminProvider, useAdmin } from "@/app/context/admin"
import { Toaster } from "@/components/ui/toaster"

function SubAdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { role, loading } = useAdmin()

    if (loading) return <div>Loading...</div>

    if (role !== "SUB_ADMIN") {
        return null;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <AdminSidebar />

            <div className="flex flex-1 flex-col lg:ml-64">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
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
