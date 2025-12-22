"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Search } from "lucide-react"

/* ================= DEMO DATA ================= */
const usersData = [
  {
    id: 1,
    userName: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: "+91 98765 43210",
    schoolName: "Greenwood High School",
    className: "Class 10-A",
    bundleName: "Science Bundle",
    orderNumber: "ORD-1001",
    orderDate: "2025-01-15",
    totalAmount: 4500,
    status: "Pending",
  },
  {
    id: 2,
    userName: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "+91 98765 43211",
    schoolName: "Greenwood High School",
    className: "Class 9-B",
    bundleName: "Math Bundle",
    orderNumber: "ORD-1005",
    orderDate: "2025-01-18",
    totalAmount: 3500,
    status: "Completed",
  },
  {
    id: 3,
    userName: "Amit Kumar",
    email: "amit.kumar@email.com",
    phone: "+91 98765 43212",
    schoolName: "Sunrise Academy",
    className: "Class 12-A",
    bundleName: "Complete Bundle",
    orderNumber: "ORD-1002",
    orderDate: "2025-01-20",
    totalAmount: 3200,
    status: "Completed",
  },
  {
    id: 4,
    userName: "Sneha Gupta",
    email: "sneha.gupta@email.com",
    phone: "+91 98765 43213",
    schoolName: "Maple Leaf School",
    className: "Class 11-C",
    bundleName: "English Bundle",
    orderNumber: "ORD-1003",
    orderDate: "2025-01-25",
    totalAmount: 5000,
    status: "Cancelled",
  },
  {
    id: 5,
    userName: "Vikram Singh",
    email: "vikram.singh@email.com",
    phone: "+91 98765 43214",
    schoolName: "Riverdale High",
    className: "Class 8-A",
    bundleName: "History Bundle",
    orderNumber: "ORD-1004",
    orderDate: "2025-02-01",
    totalAmount: 2800,
    status: "Pending",
  },
  {
    id: 6,
    userName: "Anjali Mehta",
    email: "anjali.mehta@email.com",
    phone: "+91 98765 43215",
    schoolName: "Sunrise Academy",
    className: "Class 10-B",
    bundleName: "Science Bundle",
    orderNumber: "ORD-1006",
    orderDate: "2025-02-05",
    totalAmount: 4200,
    status: "Pending",
  },
]

/* ================= COMPONENT ================= */
export function OrdersTable() {
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null)

  const uniqueSchools = Array.from(new Set(usersData.map((user) => user.schoolName)))

  const filteredUsers = selectedSchool ? usersData.filter((user) => user.schoolName === selectedSchool) : []

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        {selectedSchool && (
          <Button variant="outline" size="icon" onClick={() => setSelectedSchool(null)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-9" />
        </div>
      </div>

      {!selectedSchool && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {uniqueSchools.map((schoolName) => {
            const schoolUsers = usersData.filter((user) => user.schoolName === schoolName)
            const totalOrders = schoolUsers.length
            const totalValue = schoolUsers.reduce((sum, user) => sum + user.totalAmount, 0)

            return (
              <Card
                key={schoolName}
                className="cursor-pointer transition-colors hover:bg-accent"
                onClick={() => setSelectedSchool(schoolName)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{schoolName}</CardTitle>
                  <CardDescription>
                    {totalOrders} {totalOrders === 1 ? "order" : "orders"}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      )}

      {selectedSchool && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{selectedSchool}</h2>
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{user.userName}</CardTitle>
                      <CardDescription className="mt-1">
                        <div className="space-y-1">
                          <div>{user.email}</div>
                          <div>{user.phone}</div>
                          <div className="text-xs">
                            {user.className} • {user.bundleName}
                          </div>
                        </div>
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        user.status === "Completed"
                          ? "default"
                          : user.status === "Pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Order: {user.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">Date: {user.orderDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{user.totalAmount.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground mt-1">Total Amount</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
