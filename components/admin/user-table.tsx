"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import Printable from "../order/Printable";

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

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 400;

type Order = {
  id: string;
  phone: string;
  landmark: string;
  pincode: string;
  class: string;
  totalAmount: number;
  createdAt: string;
  status: "ORDER_PLACED" | "PACKAGING_DONE" | "OUT_FOR_DELIVERY" | "DELIVERED";

  user?: {
    name: string;
    email: string;
    phone: string;
  };

  students: {
    student: {
      id: string;
      name: string;
      rollNo: number;
      parent: {
        email: string;
        phone: string;
        address: string;
      };
    };
  }[];

  items?: {
    product?: {
      name: string;
    };
  }[];
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

/* ================= PDF HELPERS ================= */
// Rotates a portrait canvas 90° so the resulting PDF page is always landscape.
// If the content is already wider than it is tall, it's returned untouched.
const toLandscapeCanvas = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
  if (canvas.width >= canvas.height) return canvas;

  const rotated = document.createElement("canvas");
  rotated.width = canvas.height;
  rotated.height = canvas.width;

  const ctx = rotated.getContext("2d");
  if (!ctx) return canvas;

  ctx.translate(rotated.width / 2, rotated.height / 2);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

  return rotated;
};

const downloadElementAsPdf = async (elementId: string, filename: string) => {
  const el = document.getElementById(elementId);
  if (!el) return;

  const rawCanvas = await html2canvas(el, {
    useCORS: true,
    backgroundColor: "#ffffff",
    scale: 2,
    scrollX: 0,
    scrollY: 0,
    windowWidth: el.scrollWidth,
    windowHeight: el.scrollHeight,
  });

  const canvas = toLandscapeCanvas(rawCanvas);
  const imgData = canvas.toDataURL("image/png");

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  const maxPdfWidth = 297; // A4 landscape width in mm
  const pxToMm = 25.4 / 96;
  let pdfWidth = (imgWidth * pxToMm) / 2; // /2 because scale: 2 was used
  let pdfHeight = (imgHeight * pxToMm) / 2;

  if (pdfWidth > maxPdfWidth) {
    const scaleFactor = maxPdfWidth / pdfWidth;
    pdfWidth = maxPdfWidth;
    pdfHeight = pdfHeight * scaleFactor;
  }

  const pdf = new jspdf({
    orientation: "l",
    unit: "mm",
    format: [pdfWidth, pdfHeight],
  });

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(filename);
};

/* ================= COMPONENT ================= */
export function OrdersTable({ role, subAdminSchoolId }: Props) {
  const [schools, setSchools] = useState<School[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [schoolLoading, setSchoolLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [receiptData, setReceiptData] = useState<Order | null>(null);

  const isFetchingRef = useRef(false);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(false);
  const fetchFailedRef = useRef(false);
  const activeSchoolIdRef = useRef<string | null>(null);
  const searchRef = useRef("");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);
  useEffect(() => {
    fetchFailedRef.current = fetchFailed;
  }, [fetchFailed]);

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

      // Get actual canvas dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Define max PDF width (A4 width in mm)
      const maxPdfWidth = 210;

      // Calculate PDF dimensions maintaining aspect ratio
      // Convert pixels to mm (assuming 96 DPI: 1 inch = 25.4mm, 96px = 25.4mm)
      const pxToMm = 25.4 / 96;
      let pdfWidth = (imgWidth * pxToMm) / 2; // divide by 2 because we used scale: 2
      let pdfHeight = (imgHeight * pxToMm) / 2;

      // If content is wider than A4, scale down proportionally
      if (pdfWidth > maxPdfWidth) {
        const scaleFactor = maxPdfWidth / pdfWidth;
        pdfWidth = maxPdfWidth;
        pdfHeight = pdfHeight * scaleFactor;
      }

      // Create PDF with actual content dimensions
      const pdf = new jspdf({
        orientation: pdfHeight > pdfWidth ? "p" : "l",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt-${order.id}.pdf`);
    }, 500);
  };

  
const handlePrint = async (order: Order) => {
  setReceiptData(order);
    setTimeout(async () => {
      const receipt = document.getElementById("printReceipt");
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

      // Get actual canvas dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Define max PDF width (A4 width in mm)
      const maxPdfWidth = 210;

      // Calculate PDF dimensions maintaining aspect ratio
      // Convert pixels to mm (assuming 96 DPI: 1 inch = 25.4mm, 96px = 25.4mm)
      const pxToMm = 25.4 / 96;
      let pdfWidth = (imgWidth * pxToMm) / 2; // divide by 2 because we used scale: 2
      let pdfHeight = (imgHeight * pxToMm) / 2;

      // If content is wider than A4, scale down proportionally
      if (pdfWidth > maxPdfWidth) {
        const scaleFactor = maxPdfWidth / pdfWidth;
        pdfWidth = maxPdfWidth;
        pdfHeight = pdfHeight * scaleFactor;
      }

      // Create PDF with actual content dimensions
      const pdf = new jspdf({
        orientation: pdfHeight > pdfWidth ? "p" : "l",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt-${order.id}.pdf`);
    }, 500);
  };


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

  /* ================= FETCH ORDERS (page + search aware) ================= */
  const fetchOrders = useCallback(
    async (school: School, pageToFetch: number = 1, searchTerm: string = "") => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      const append = pageToFetch > 1;
      activeSchoolIdRef.current = school.id;
      searchRef.current = searchTerm;

      try {
        if (!append) {
          setLoading(true);
          setOrders([]);
          setPage(1);
          setHasMore(false);
        } else {
          setLoadingMore(true);
        }
        setFetchFailed(false);

        const params = new URLSearchParams({
          schoolId: school.id,
          page: String(pageToFetch),
          limit: String(PAGE_SIZE),
        });
        if (searchTerm.trim()) params.set("search", searchTerm.trim());

        const res = await fetch(`/api/admin/orders?${params.toString()}`);
        const data = await res.json();

        // Ignore stale responses from a school/search combo we've since moved away from
        if (activeSchoolIdRef.current !== school.id) return;

        if (data.success) {
          setOrders((prev) => (append ? [...prev, ...data.orders] : data.orders));
          setHasMore(Boolean(data.pagination?.hasNextPage));
          setPage(pageToFetch);
        } else {
          if (!append) setOrders([]);
          setFetchFailed(true);
        }
      } catch (err) {
        console.error(err);
        if (activeSchoolIdRef.current === school.id) {
          if (!append) setOrders([]);
          setFetchFailed(true);
        }
      } finally {
        if (activeSchoolIdRef.current === school.id) {
          setLoading(false);
          setLoadingMore(false);
        }
        isFetchingRef.current = false;
      }
    },
    []
  );

  /* ================= DEBOUNCE SEARCH INPUT ================= */
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [search]);

  /* ================= FETCH ON SCHOOL SELECT OR SEARCH CHANGE ================= */
  useEffect(() => {
    if (!selectedSchool) return;
    fetchOrders(selectedSchool, 1, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSchool?.id, debouncedSearch]);

  /* ================= INFINITE SCROLL OBSERVER ================= */
  useEffect(() => {
    if (!selectedSchool) return;
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreRef.current &&
          !fetchFailedRef.current &&
          !isFetchingRef.current
        ) {
          fetchOrders(selectedSchool, pageRef.current + 1, searchRef.current);
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [selectedSchool, fetchOrders]);

  useEffect(() => {
    if (role === "SUB_ADMIN" && subAdminSchoolId) {
      setSelectedSchool({ id: subAdminSchoolId, name: "Your School" });
    } else {
      fetchSchools();
    }
  }, [role, subAdminSchoolId]);

  return (
    <div className="space-y-4">
      <ReceiptBase order={receiptData} />
      <Printable order={receiptData} />
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
              setDebouncedSearch("");
              setHasMore(false);
              setFetchFailed(false);
              setPage(1);
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
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
                setSelectedSchool(school);
              }}
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

      {/* ================= ORDERS ================= */}
      {selectedSchool && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {role === "ADMIN" ? selectedSchool.name : ""}
          </h2>

          {/* 🔍 Search Orders (server-side) */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by student, parent, email, phone, order ID, roll no, product, status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md pl-10"
            />
          </div>

          {/* ⏳ Loading (initial load or new search) */}
          {loading && (
            <div className="flex items-center justify-center mt-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* 📭 Empty / Failed */}
          {!loading && orders.length === 0 && (
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-muted-foreground">
                {fetchFailed ? "Failed to load orders." : "No orders found"}
              </p>
              {fetchFailed && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchOrders(selectedSchool, 1, searchRef.current)}
                >
                  Retry
                </Button>
              )}
            </div>
          )}

          {/* 📦 Orders List */}
          {!loading && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="gap-1">
                  <CardHeader>
                    <div className="max-md:flex-col flex gap-3 justify-between">
                      <div className="space-y-1">
                        {order?.students?.length ? (
                          order?.students?.map(({ student }: any) => {
                            return (
                              <div className="space-y-1" key={student.id}>
                                <div className="text-base">
                                  <span className="font-semibold">Name: </span>
                                  {student.name}
                                </div>
                                <p className="text-sm">
                                  <span className="font-semibold">Roll No: </span>{" "}
                                  {student.rollNo} • {order.class}
                                </p>
                              </div>
                            );
                          })
                        ) : (
                          <div>No Student Info Found!</div>
                        )}
                        <CardDescription>
                          {order?.students?.[0]?.student?.parent?.email}
                          {order?.students?.[0]?.student?.parent?.phone &&
                            ` • ${order?.students?.[0]?.student?.parent?.phone}`}
                        </CardDescription>
                      </div>
                      <div className="grid gap-2">
                        <Select
                          disabled={statusUpdating}
                          value={order.status}
                          onValueChange={async (value: any) => {
                            setStatusUpdating(true);
                            const request = await fetch("/api/order/change-status", {
                              method: "PATCH",
                              body: JSON.stringify({
                                orderId: order.id,
                                status: value,
                              }),
                            });
                            const response = await request.json();
                            if (response.success) {
                              const index = orders.findIndex(
                                (item) => item.id === order.id
                              );
                              const next = [...orders];
                              next[index] = { ...next[index], status: value };
                              setOrders(next);
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
                              <SelectValue placeholder={order.status.replaceAll("_", " ")} />{" "}
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
                        <div className="flex justify-center items-center gap-2">
                          <Button onClick={() => handleReceipt(order)}>
                            <Download />
                            Full Receipt
                          </Button>
                          <Button onClick={() => handlePrint(order)}>
                            <Download />
                            Printable Receipt
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex justify-between">
                    <div>
                      <p className="text-sm">
                        Order Placed on:{" "}
                        {new Date(order.createdAt.split("T")[0]).toLocaleDateString()}
                      </p>
                      <p className="text-sm">Address: {order.landmark}</p>
                      <p className="text-sm">Pincode: {order.pincode}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold">
                        ₹{order.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Amount</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Sentinel element the IntersectionObserver watches */}
              <div ref={loadMoreRef} className="h-1 w-full" />

              {loadingMore && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

                <div className="flex justify-center py-4">
                  <Button
                    variant="outline"
                    onClick={() => fetchOrders(selectedSchool, page + 1, searchRef.current)}
                  >
                    Load More
                  </Button>
                </div>



              {!hasMore && !loadingMore && (
                <p className="text-center text-xs text-muted-foreground py-2">
                  No more orders
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
