"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreHorizontal, Search } from "lucide-react"

/* ================= DEMO DATA ================= */
const orders = [
  {
    id: 1,
    schoolName: "Greenwood High School",
    orderNumber: "ORD-1001",
    orderDate: "2025-01-15",
    totalAmount: 4500,
    status: "Pending",
  },
  {
    id: 2,
    schoolName: "Sunrise Academy",
    orderNumber: "ORD-1002",
    orderDate: "2025-01-20",
    totalAmount: 3200,
    status: "Completed",
  },
  {
    id: 3,
    schoolName: "Maple Leaf School",
    orderNumber: "ORD-1003",
    orderDate: "2025-01-25",
    totalAmount: 5000,
    status: "Cancelled",
  },
  {
    id: 4,
    schoolName: "Riverdale High",
    orderNumber: "ORD-1004",
    orderDate: "2025-02-01",
    totalAmount: 2800,
    status: "Pending",
  },
]

/* ================= COMPONENT ================= */
export function OrdersTable() {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-9" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>School Name</TableHead>
              <TableHead>Order Number</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Total Amount (₹)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.schoolName}</TableCell>
                <TableCell className="text-muted-foreground">{order.orderNumber}</TableCell>
                <TableCell className="text-muted-foreground">{order.orderDate}</TableCell>
                <TableCell className="text-muted-foreground">₹{order.totalAmount}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "Completed"
                        ? "default"
                        : order.status === "Pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
