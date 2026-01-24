"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronLeft,
  Loader2,
  Search,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import ReceiptBase from "../Receipt";
import dynamic from "next/dynamic";
import html2canvas from "html2canvas-pro";
import jspdf from "jspdf";
/* ================= TYPES ================= */
type School = {
  id: string;
  name: string;
};
const ORDER_STATUS = [
  "ORDER_PLACED",
  "PACKAGING_DONE",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

type Order = {
  id: string;
  userName: string;
  email: string;
  phone: string;
  landmark: string;
  pincode: string;
  class: string;
  bundleName: string;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  createdAt: string;
  student: {
    name: string;
    rollNo: number;
    parent: { email: string; phone: string; address: string };
  };
  status: "ORDER_PLACED" | "PACKAGING_DONE" | "OUT_FOR_DELIVERY" | "DELIVERED";
};

type Props = {
  role?: "ADMIN" | "SUB_ADMIN";
  subAdminSchoolId?: string;
};
const decideStatus = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-700 border-green-300";
      break;
    case "OUT_FOR_DELIVERY":
      return "bg-orange-100 text-orange-700 border-orange-300";
      break;
    case "PACKAGING_DONE":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
      break;
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
      break;
  }
};
/* ================= COMPONENT ================= */
export function OrdersTable({ role, subAdminSchoolId }: Props) {
  const [schools, setSchools] = useState<School[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [schoolLoading, setSchoolLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [receiptData, setReceiptData] = useState<Order | null>(null);


  const handleReceipt = async (order: Order) => {
  setReceiptData(order);

  setTimeout(async () => {
    const receipt = document.getElementById("receipt");
    if (!receipt) return;

    const canvas = await html2canvas(receipt, {
      useCORS: true,
      backgroundColor: "#ffffff",
      scale: 2,
      scrollX: 0,
      scrollY: 0,
      windowWidth: receipt.scrollWidth,
      windowHeight: receipt.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");

    // A4 width in mm
    const pdfWidth = 210;

    // Calculate proportional height in mm
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Create PDF with dynamic height
    const pdf = new jspdf({
      orientation: "p",
      unit: "mm",
      format: [pdfWidth, pdfHeight],
    });

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Receipt-${order.id}.pdf`);
  }, 500);
};


  // const handleReceipt = async (order: Order) => {
  //   setReceiptData(order);

  //   setTimeout(() => {
  //     const receipt = document.getElementById("receipt");
  //     html2canvas(receipt!, {
  //       useCORS: true,
  //       backgroundColor: "#ffffff",
  //       scale: 2,
  //       windowWidth: 794,
  //       scrollX: 0,
  //       scrollY: 0,
  //     }).then((canvas) => {
  //       const imgData = canvas.toDataURL("image/png");
  //       const pdf = new jspdf("p", "mm", "a4"); // 'p' for portrait, 'mm' for units, 'a4' for size
  //       const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
  //       const imgHeight = (canvas.height * pageWidth) / canvas.width;

  //       pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
  //       pdf.save(`Receipt-${order.id}.pdf`);
  //     });
  //   }, 2000);
  // };
  /* ================= FETCH SCHOOLS ================= */
  const fetchSchools = async () => {
    if (role === "SUB_ADMIN") return;
    setSchoolLoading(true);
    try {
      const res = await fetch("/api/schools");
      const data = await res.json();
      if (data.success) setSchools(data.schools);
    } catch (err) {
      console.error(err);
    } finally {
      setSchoolLoading(false);
    }
  };

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async (school: School) => {
    try {
      setLoading(true);
      setSelectedSchool(school);
      setSearch("");

      const res = await fetch(`/api/admin/orders?schoolId=${school.id}`);
      const data = await res.json();
      if (data.success) {
        // console.log(data.orders);

        setOrders(data.orders);
      } else setOrders([]);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTERED ORDERS ================= */
  const filteredOrders = orders.filter((order) => {
    const q = search.toLowerCase();
    return (
      order?.userName?.toLowerCase().includes(q) ||
      order?.email?.toLowerCase().includes(q) ||
      order?.orderNumber?.toLowerCase().includes(q) ||
      order?.status?.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (role === "SUB_ADMIN" && subAdminSchoolId) {
      setSelectedSchool({ id: subAdminSchoolId, name: "Your School" });
      fetchOrders({ id: subAdminSchoolId, name: "Your School" });
    } else {
      fetchSchools();
    }
  }, [role, subAdminSchoolId]);

  return (
    <div className="space-y-4">
      <ReceiptBase order={receiptData} />
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-2">
        {selectedSchool && role === "ADMIN" && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSelectedSchool(null);
              setOrders([]);
              setSearch("");
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
                <CardTitle className="text-xl flex justify-center items-center">
                  {school.name}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {schoolLoading && (
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* {selectedSchool.name} */}

      {/* ================= ORDERS ================= */}
      {selectedSchool && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {role === "ADMIN" ? selectedSchool.name : ""}
          </h2>

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
            <p className="text-center text-muted-foreground">No orders found</p>
          )}

          {/* 📦 Orders List */}
          {!loading && filteredOrders.length > 0 && (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="max-md:flex-col flex gap-3 justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {order.student.name}
                        </CardTitle>
                        <p className="text-sm">
                          Roll No: {order.student.rollNo} • {order.class}
                        </p>
                        <CardDescription>
                          {order?.student.parent.email}{" "}
                          {order?.student.parent.phone &&
                            `• ${order?.student.parent.phone}`}
                        </CardDescription>
                      </div>
                      <div className="grid gap-2">
                        <Select
                          disabled={statusUpdating}
                          value={order.status}
                          onValueChange={async (value: any) => {
                            setStatusUpdating(true);
                            const request = await fetch(
                              "/api/order/change-status",
                              {
                                method: "PATCH",
                                body: JSON.stringify({
                                  orderId: order.id,
                                  status: value,
                                }),
                              }
                            );
                            const response = await request.json();
                            if (response.success) {
                              const index = orders.findIndex(
                                (item) => item.id === order.id
                              );
                              orders[index].status = value;
                              setOrders(orders);
                            }
                            setStatusUpdating(false);
                          }}
                        >
                          <SelectTrigger
                            className={`shadow-sm max-h-10 rounded-lg outline-none px-2 text-sm py-2 h-fit ${decideStatus(
                              order.status
                            )}`}
                          >
                            <div className="flex justify-center items-center gap-1">
                              <SelectValue
                                placeholder={order.status.replaceAll("_", " ")}
                              />{" "}
                              <ChevronDown size={15} />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {ORDER_STATUS.map((status: string) => (
                                <SelectItem key={status} value={status}>
                                  {status.replaceAll("_", " ")}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Button onClick={() => handleReceipt(order)}>
                          <Download />
                          Download Receipt
                        </Button>
                      </div>
                      {/* <Badge
                      className={`py-2 h-fit ${order.status === "DELIVERED" ? "text-green-400 bg-green-500/20" : order.status === "OUT_FOR_DELIVERY" ? "bg-amber-500/20 text-amber-400" : "text-red-400 bg-red-500/20"}`}
                      >
                        {order.status.replaceAll("_"," ")}
                      </Badge> */}
                    </div>
                  </CardHeader>

                  <CardContent className="flex justify-between">
                    <div>
                      <p className="text-sm">
                        Order Placed on: {order.createdAt.split("T")[0]}
                      </p>
                      <p className="text-sm">Address: {order.landmark}</p>
                      <p className="text-sm">Pincode: {order.pincode}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold">
                        ₹{order.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Amount
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
