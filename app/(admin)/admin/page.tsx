"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalyticsCharts } from "@/components/admin/analytics-chart"
import { UsersTable } from "@/components/admin/user-table"
import { SchoolsTable } from "@/components/admin/school-table"
import { AdminHeader } from "@/components/admin/header"
import { useAdmin } from "@/app/context/admin"

export default function AdminDashboard() {
  const { activeTab } = useAdmin()

  return (
    <>
      <AdminHeader />

      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        {activeTab === "analytics" && <AnalyticsCharts />}

        {activeTab === "users" && (
          <Card>
            <CardHeader>
              <CardTitle>Registered Users</CardTitle>
              <CardDescription>
                View and manage all registered users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable />
            </CardContent>
          </Card>
        )}

        {activeTab === "schools" && (
          <Card>
            <CardHeader>
              <CardTitle>Schools</CardTitle>
              <CardDescription>
                View and manage all schools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SchoolsTable />
            </CardContent>
          </Card>
        )}
      </main>
    </>
  )
}
