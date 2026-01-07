"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { OrdersTable } from "@/components/admin/user-table"

export default function OrdersPage() {
  return (
    <Card>
      <CardHeader>
      </CardHeader>
      <CardContent>
        <OrdersTable role="ADMIN" />
      </CardContent>
    </Card>
  )
}