"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChevronLeft, Loader2, Search } from "lucide-react"

/* ================= TYPES ================= */
type School = {
  id: string
  name: string
}

type Order = {
  id: string
  userName: string
  email: string
  phone: string
  className: string
  bundleName: string
  orderNumber: string
  orderDate: string
  totalAmount: number
  status: "Pending" | "Completed" | "Cancelled"
}

type Props = {
  role?: "ADMIN" | "SUB_ADMIN"
  subAdminSchoolId?: string
}

/* ================= COMPONENT ================= */
export function OrdersTable({ role, subAdminSchoolId }: Props) {
  const [schools, setSchools] = useState<School[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [schoolLoading, setSchoolLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  /* ================= FETCH SCHOOLS ================= */
  const fetchSchools = async () => {
    if (role === "SUB_ADMIN") return
    setSchoolLoading(true)
    try {
      const res = await fetch("/api/schools")
      const data = await res.json()
      if (data.success) setSchools(data.schools)
    } catch (err) {
      console.error(err)
    } finally {
      setSchoolLoading(false)
    }
  }

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async (school: School) => {
    try {
      setLoading(true)
      setSelectedSchool(school)
      setSearch("")

      const res = await fetch(`/api/admin/orders?schoolId=${school.id}`)
      const data = await res.json()
      if (data.success) setOrders(data.orders)
      else setOrders([])
    } catch (err) {
      console.error(err)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  /* ================= FILTERED ORDERS ================= */
  const filteredOrders = orders.filter((order) => {
    const q = search.toLowerCase()
    return (
      order?.userName?.toLowerCase().includes(q) ||
      order?.email?.toLowerCase().includes(q) ||
      order?.orderNumber?.toLowerCase().includes(q) ||
      order?.status?.toLowerCase().includes(q)
    )
  })

  useEffect(() => {
    if (role === "SUB_ADMIN" && subAdminSchoolId) {
      setSelectedSchool({ id: subAdminSchoolId, name: "Your School" })
      fetchOrders({ id: subAdminSchoolId, name: "Your School" })
    } else {
      fetchSchools()
    }
  }, [role, subAdminSchoolId])

  return (
    <div className="space-y-4">
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-2">
        {selectedSchool && role === "ADMIN" && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSelectedSchool(null)
              setOrders([])
              setSearch("")
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* ================= SCHOOLS ================= */}
      {!selectedSchool && role === "ADMIN" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {schools.map((school) => (
            <Card
              key={school.id}
              className="cursor-pointer transition-colors hover:bg-accent"
              onClick={() => fetchOrders(school)}
            >
              <CardHeader>
                <CardTitle className="text-xl flex justify-center items-center">{school.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {schoolLoading && <div className="flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}

      {/* {selectedSchool.name} */}

      {/* ================= ORDERS ================= */}
      {selectedSchool && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{role === "ADMIN" ? selectedSchool.name : ""}</h2>

          {/* 🔍 Search Orders */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, order number or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md pl-10"
            />
          </div>

          {/* ⏳ Loading */}
          {loading && (
            <div className="flex items-center justify-center mt-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* 📭 Empty */}
          {!loading && filteredOrders.length === 0 && (
            <p className="text-center text-muted-foreground">
              No orders found
            </p>
          )}

          {/* 📦 Orders List */}
          {!loading && filteredOrders.length > 0 && (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-base">{order.userName}</CardTitle>
                        <CardDescription>
                          {order.email} • {order.phone}
                        </CardDescription>
                      </div>
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
                    </div>
                  </CardHeader>

                  <CardContent className="flex justify-between">
                    <div>
                      <p className="text-sm">Order: {order.orderNumber}</p>
                      <p className="text-sm">Date: {order.orderDate}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold">₹{order.totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Amount</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
