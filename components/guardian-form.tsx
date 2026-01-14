"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Phone, User, MapPin, LucideLoader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation";
import { toast } from "sonner"

interface GuardianFormProps {
  planName: string
  planPrice: string
  onBack: () => void
}

type Class = {
  id: string
  name: string
  academicYear: string
  sections: string[]
}

type Product = {
  id: string
  name: string
  description: string
  category: string
  class?: Class
  stock: number
  brand: string
  price: number
  image: string | null
}


type OrderProduct = Product & {
  quantity: number
}


export function GuardianForm() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get("schoolId");
  const classId = searchParams.get("classId");

  // State updated: removed address, added landmark & pincode
  const [formData, setFormData] = useState({
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    landmark: "",
    pincode: "",
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Record<string, { checked: boolean; quantity: number }>>({})
  const [user, setUser] = useState<any>(null)
  const [school, setSchool] = useState<any>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(phone)
  }

  const validatePincode = (pin: string) => {
    const pinRegex = /^[0-9]{6}$/
    return pinRegex.test(pin)
  }

  const fetchSchool = async (schoolId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/schools/${schoolId}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch school");
      }

      const data = await res.json();
      if (data.success) {
        setSchool(data.school);
      } else {
        setSchool(null);
      }
    } catch (err) {
      console.error("Failed to fetch school", err);
    } finally {
      setLoading(false);
    }
  };


  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/products/filter", {
        method: "POST",
        body: JSON.stringify({
          schoolId: schoolId,
          classId: classId,
        }),
      });
      const data = await res.json()
      const allProducts = data.success ? data.data : []
      
      const storedSelection = localStorage.getItem('selectedProducts')
      if (storedSelection) {
        const selected = JSON.parse(storedSelection)
        const selectionMap: Record<string, { checked: boolean; quantity: number }> = {}
        selected.forEach((item: any) => {
          selectionMap[item.id] = { checked: item.checked, quantity: item.quantity }
        })
        setSelectedProducts(selectionMap)
        localStorage.removeItem('selectedProducts')
      }
      
      setProducts(allProducts)
    } catch (err) {
      console.error("Failed to fetch products", err)
    } finally {
      setLoading(false)
    }
  }

  const groupedByCategory = products.reduce((acc, product) => {
    const category = product.category as "TEXTBOOK" | "NOTEBOOK" | "STATIONARY"
    const selection = selectedProducts[product.id]
    if (selection && selection.checked) {
      if (!acc[category]) acc[category] = []
      acc[category].push({ ...product, stock: selection.quantity })
    }
    return acc
  }, {} as Record<"TEXTBOOK" | "NOTEBOOK" | "STATIONARY", Product[]>)

  const categoryTotals = Object.entries(groupedByCategory).reduce(
    (acc, [category, items]) => {
      acc[category as keyof typeof acc] = items.reduce(
        (sum, product) => sum + product.price * product.stock,
        0
      )
      return acc
    },
    {
      TEXTBOOK: 0,
      NOTEBOOK: 0,
      STATIONARY: 0,
    }
  )
  const grandTotal = Object.values(categoryTotals).reduce(
    (sum, val) => sum + val,
    0
  )

  const sendOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // --- Frontend Validation ---
    const newErrors: Record<string, string> = {}

    if (!formData.guardianName.trim()) newErrors.guardianName = "Parent name is required"

    if (!formData.guardianPhone) {
      newErrors.guardianPhone = "Phone number is required"
    } else if (!validatePhone(formData.guardianPhone)) {
      newErrors.guardianPhone = "Enter valid 10-digit phone"
    }

    if (!formData.landmark.trim()) newErrors.landmark = "Landmark is required"

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required"
    } else if (!validatePincode(formData.pincode)) {
      newErrors.pincode = "Enter valid 6-digit pincode"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Start Razorpay payment process
    setLoading(true);
    try {
      await startRazorpayPayment();
    } catch (err) {
      console.error("Payment failed", err);
      toast.error("Payment failed")
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      const userRes = await fetch("/api/user/details");
      const resData = await userRes.json();
      if (resData.success) {
        const { user: userData } = resData;
        setUser(userData);

        setFormData(prev => ({
          ...prev,
          guardianName: userData.name,
          guardianEmail: userData.email,
          guardianPhone: userData.phone || "",
          // Note: Landmark/Pincode are strictly for delivery, 
          // so we don't autofill from generic address to ensure accuracy
        }));
      }
    }
    fetchDetails();
    fetchProducts();
    fetchSchool(schoolId as string)
  }, []);

  //razorpay integration
  const startRazorpayPayment = async () => {
    const res = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: grandTotal }),
    })

    const data = await res.json()
    if (!data.success) throw new Error("Order creation failed")

    const isLoaded = await import("@/lib/loadRazorpay").then(m => m.loadRazorpay())
    if (!isLoaded) {
      toast.error("Razorpay SDK failed")
      return
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: "INR",
      name: "School Stationery",
      description: "Stationery Order",
      order_id: data.order.id,
      handler: async function (response: any) {
        await verifyAndPlaceOrder(response)
      },
      prefill: {
        name: formData.guardianName,
        email: formData.guardianEmail,
        contact: formData.guardianPhone,
      },
      theme: { color: "#fbbf24" },
    }

    // @ts-ignore
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const verifyAndPlaceOrder = async (payment: any) => {
    const verifyRes = await fetch("/api/razorpay/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    })

    const verifyData = await verifyRes.json()
    if (!verifyData.success) {
      toast.error("Payment verification failed")
      setLoading(false);
      return
    }

    // ✅ Payment verified → create DB order
    await sendFinalOrder(payment)
  }

  const sendFinalOrder = async (payment: any) => {
    const orderItems = products
      .filter(p => selectedProducts[p.id]?.checked)
      .map(p => ({
        productId: p.id,
        quantity: selectedProducts[p.id]?.quantity || p.stock,
      }))

    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: user?.children[0].id,
        paymentMethod: "Razorpay",
        phone: formData.guardianPhone,
        landmark: formData.landmark,
        pincode: formData.pincode,
        razorpayOrderId: payment.razorpay_order_id,
        razorpayPaymentId: payment.razorpay_payment_id,
        razorpaySignature: payment.razorpay_signature,
        items: orderItems,
      }),
    })

    const data = await res.json()
    if (data.success) {
      toast.success("Order placed successfully 🎉")
      setTimeout(() => {
        window.location.replace("/")
      }, 2000)
    } else {
      toast.error("Order failed")
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1 pb-4 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <CardTitle className="text-2xl sm:text-3xl font-semibold">Parent / Guardian Information</CardTitle>
            </div>
            <p className="text-sm sm:text-base">
              Please provide details to complete your order
            </p>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6">
            <form onSubmit={sendOrder} className="space-y-4 sm:space-y-5">
              {/* Parent / Guardian Name */}
              <div className="space-y-2">
                <Label htmlFor="guardianName" className="text-sm font-medium">
                  Parent / Guardian Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    disabled
                    id="guardianName"
                    type="text"
                    placeholder="Enter guardian's full name"
                    value={formData.guardianName || ""}
                    onChange={(e) => handleInputChange("guardianName", e.target.value)}
                    className={cn(
                      "pl-10 sm:pl-11 h-11 sm:h-12 text-sm border-0 bg-transparent",
                      errors.guardianName && "border-destructive focus-visible:ring-destructive",
                    )}
                  />
                </div>
                {errors.guardianName && <p className="text-sm text-destructive">{errors.guardianName}</p>}
              </div>

              {/* Parent / Guardian Phone */}
              <div className="space-y-2">
                <Label htmlFor="guardianPhone" className="text-sm sm:text-base font-medium">
                  Parent / Guardian Phone Number <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    id="guardianPhone"
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    value={formData.guardianPhone || ""}
                    onChange={(e) => handleInputChange("guardianPhone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className={cn(
                      "pl-10 sm:pl-11 h-11 sm:h-12 text-sm sm:text-base border-0 bg-transparent",
                      errors.guardianPhone && "border-destructive focus-visible:ring-destructive",
                    )}
                    maxLength={10}
                  />
                </div>
                {errors.guardianPhone && <p className="text-sm text-destructive">{errors.guardianPhone}</p>}
              </div>

              {/* Parent / Guardian Email */}
              <div className="space-y-2">
                <Label htmlFor="guardianEmail" className="text-sm sm:text-base font-medium">
                  Parent / Guardian Email <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" />
                    <Input
                      id="guardianEmail"
                      type="email"
                      placeholder="Enter guardian's email"
                      value={formData.guardianEmail || ""}
                      onChange={(e) => handleInputChange("guardianEmail", e.target.value)}
                      className="pl-10 sm:pl-11 h-11 sm:h-12 text-sm sm:text-base border-0 bg-transparent"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* LANDMARK (Replaces Address) */}
              <div className="space-y-2">
                <Label htmlFor="landmark" className="text-sm sm:text-base font-medium">
                  Landmark <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    id="landmark"
                    type="text"
                    placeholder="Enter nearest landmark"
                    value={formData.landmark}
                    onChange={(e) => handleInputChange("landmark", e.target.value)}
                    className={cn(
                      "pl-10 sm:pl-11 h-11 sm:h-12 text-sm sm:text-base border-0 bg-transparent",
                      errors.landmark && "border-destructive focus-visible:ring-destructive",
                    )}
                  />
                </div>
                {errors.landmark && <p className="text-sm text-destructive">{errors.landmark}</p>}
              </div>

              {/* PINCODE (Replaces Address) */}
              <div className="space-y-2">
                <Label htmlFor="pincode" className="text-sm sm:text-base font-medium">
                  Pincode <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    id="pincode"
                    type="tel"
                    placeholder="Enter 6-digit pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className={cn(
                      "pl-10 sm:pl-11 h-11 sm:h-12 text-sm sm:text-base border-0 bg-transparent",
                      errors.pincode && "border-destructive focus-visible:ring-destructive",
                    )}
                    maxLength={6}
                  />
                </div>
                {errors.pincode && <p className="text-sm text-destructive">{errors.pincode}</p>}
              </div>

              {/* Note Display */}
              <Card className="mt-4 border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
                <CardContent className="p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-100">
                    <strong>NOTE:</strong> Your order will be delivered to the address provided above. Please ensure the details are correct.
                  </p>
                </CardContent>
              </Card>

              <Label className="text-sm sm:text-base font-medium mt-4 block">
                Child Info
              </Label>
              {
                user?.children?.length > 0 && user.children.map((items: any, index: number) => (
                  <div key={index} className="w-full flex justify-start items-center gap-3">
                    <p className="py-2 bg-gray-200 text-gray-700 px-4 w-1/3 rounded-lg text-sm font-medium">NAME: {items.name}</p>
                    <p className="py-2 bg-gray-200 text-gray-700 px-4 w-1/3 rounded-lg text-sm font-medium">ROLL NO: {items.rollNo}</p>
                    <p className="py-2 bg-gray-200 text-gray-700 px-4 w-1/3 rounded-lg text-sm font-medium">SECTION: {items.section}</p>
                  </div>
                ))
              }

              <div className="mt-6 rounded-lg border bg-muted/40 p-4 space-y-5">
                <h3 className="text-lg font-semibold">Order Summary</h3>

                {Object.entries(groupedByCategory).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <div className="font-medium text-sm">{category}</div>

                    {items.map((product) => (
                      <div
                        key={product.id}
                        className="flex justify-between text-sm pl-3"
                      >
                        <span>
                          {product.name} × {product.stock}
                        </span>
                        <span>
                          ₹{product.price * product.stock}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between font-semibold text-sm border-t pt-1">
                      <span>{category} Total</span>
                      <span>₹{categoryTotals[category as keyof typeof categoryTotals]}</span>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between text-base font-bold">
                  <span>Total Amount</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              {/* Submit Button */}
              {user?.children?.length > 0 ? (
                <div className="pt-2 sm:pt-4">
                  <Button
                    type="submit"
                    className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium cursor-pointer flex justify-center items-center bg-amber-400 hover:bg-amber-300 text-black"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? <LucideLoader2 className="text-black animate-spin" size={20} /> : "Place Order"}
                  </Button>
                </div>
              ) : (
                <div className="pt-2 sm:pt-4 text-center">
                  <p className="text-sm">
                    You don’t have any children in this school or the fees haven’t been paid.
                  </p>
                </div>
              )}

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}