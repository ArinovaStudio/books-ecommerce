"use client"

import { Card, CardContent } from "@/components/ui/card"
import { OrdersTable } from "@/components/admin/user-table"
import { useAdmin } from "@/app/context/admin"

export default function SubAdminOrdersPage() {
  const { user, schoolId } = useAdmin()

  return (
    <Card>
      <CardContent>
        <OrdersTable role={user.role} subAdminSchoolId={schoolId} />
      </CardContent>
    </Card>
  )
}