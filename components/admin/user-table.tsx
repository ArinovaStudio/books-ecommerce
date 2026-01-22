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
import { Select, SelectContent, SelectGroup, SelectItem, SelectValue } from "../ui/select"
import { SelectTrigger } from "@radix-ui/react-select"

/* ================= TYPES ================= */
type School = {
  id: string
  name: string
}
const ORDER_STATUS = [
  "ORDER_PLACED",
  "PACKAGING_DONE",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

type Order = {
  id: string
  userName: string
  email: string
  phone: string
  landmark: string;
  pincode: string;
  class: string
  bundleName: string
  orderNumber: string
  orderDate: string
  totalAmount: number
  createdAt: string
  student: {name: string, rollNo: number, 
    parent: {email: string, phone: string, address: string}
  }
  status: "ORDER_PLACED" | "PACKAGING_DONE" | "OUT_FOR_DELIVERY" | "DELIVERED"
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
  const [statusUpdating,setStatusUpdating] = useState(false);
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
      if (data.success) {
        console.log(data.orders);
        
        setOrders(data.orders)
      }
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
                        <CardTitle className="text-base">{order.student.name}</CardTitle>
                        <p className="text-sm">Roll No: {order.student.rollNo} • {order.class}</p>
                        <CardDescription>
                          {order?.student.parent.email} {order?.student.parent.phone && `• ${order?.student.parent.phone}`}
                        </CardDescription>
                      </div>
                      <Select disabled={statusUpdating} value={order.status} onValueChange={async (value: any)=>{
                        setStatusUpdating(true);
                        const request = await fetch("/api/order/change-status",{
                          method: "PATCH",
                          body:JSON.stringify({
                            orderId: order.id,
                            status: value
                          })
                        })
                        const response = await request.json();
                        if(response.success){
                          setOrders((prev)=>{
                            return [...prev.filter((ord)=>ord.id!==order.id),{...order,status: value}];
                          })
                        }
                        setStatusUpdating(false);
                      }}>
                        <SelectTrigger className={`disabled:bg-gray-200 disabled:text-white shadow-sm max-h-10 rounded-lg outline-none px-2 text-sm py-2 h-fit ${order.status === "DELIVERED" ? "text-green-400 bg-green-500/20" : order.status === "OUT_FOR_DELIVERY" ? "bg-amber-500/20 text-amber-400" : "text-red-400 bg-red-500/20"}`}>
                          <SelectValue placeholder={order.status.replaceAll("_"," ")}/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                          {
                            ORDER_STATUS.map((status: string)=><SelectItem key={status} value={status}>{status.replaceAll('_'," ")}</SelectItem>)
                          }
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {/* <Badge
                      className={`py-2 h-fit ${order.status === "DELIVERED" ? "text-green-400 bg-green-500/20" : order.status === "OUT_FOR_DELIVERY" ? "bg-amber-500/20 text-amber-400" : "text-red-400 bg-red-500/20"}`}
                      >
                        {order.status.replaceAll("_"," ")}
                      </Badge> */}
                    </div>
                  </CardHeader>

                  <CardContent className="flex justify-between">
                    <div>
                      <p className="text-sm">Order Placed on: {order.createdAt.split("T")[0]}</p>
                      <p className="text-sm">Address: {order.landmark}</p>
                      <p className="text-sm">Pincode: {order.pincode}</p>
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
