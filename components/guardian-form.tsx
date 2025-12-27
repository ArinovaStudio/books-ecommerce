"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Mail, Phone, User, MapPin, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation";

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

  const [formData, setFormData] = useState({
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    address: "",
  })




  // const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [user, setUser] = useState<any>(null)
  const [school, setSchool] = useState<any>(null)



  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(phone)
  }

  const handleSendOtp = async () => {
    const newErrors: Record<string, string> = {}

    if (!formData.guardianEmail) {
      newErrors.guardianEmail = "Email is required"
    } else if (!validateEmail(formData.guardianEmail)) {
      newErrors.guardianEmail = "Please enter a valid email"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    // Simulate API call to send OTP
    await new Promise((resolve) => setTimeout(resolve, 1500))
    // setOtpSent(true)
    setLoading(false)
    console.log("[v0] OTP sent to:", formData.guardianEmail)
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" })
      return
    }

    setLoading(true)
    // Simulate API call to verify OTP
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsVerified(true)
    setLoading(false)
    console.log("[v0] OTP verified:", otp)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.guardianName.trim()) {
      newErrors.guardianName = "Guardian name is required"
    }

    if (!formData.guardianPhone) {
      newErrors.guardianPhone = "Phone number is required"
    } else if (!validatePhone(formData.guardianPhone)) {
      newErrors.guardianPhone = "Please enter a valid 10-digit phone number"
    }

    if (!formData.guardianEmail) {
      newErrors.guardianEmail = "Email is required"
    } else if (!validateEmail(formData.guardianEmail)) {
      newErrors.guardianEmail = "Please enter a valid email"
    }

    if (!isVerified) {
      newErrors.otp = "Please verify your email with OTP"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    console.log("[v0] Form submitted:", formData)
    // Handle form submission
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
      console.log("School API response:", data);

      if (data.success) {
        setSchool(data.school); // ✅ correct key
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
      console.log(data, "this is product");
      setProducts(data.success ? data.data : [])
    } catch (err) {
      console.error("Failed to fetch products", err)
    } finally {
      setLoading(false)
    }
  }

  const groupedByCategory = products.reduce((acc, product) => {
    const category = product.category as "TEXTBOOK" | "NOTEBOOK" | "STATIONARY"

    if (!acc[category]) acc[category] = []

    acc[category].push(product)
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

  // const sendOrder = async () => {
  //   setLoading(true)
  //   try {
  //     console.log("called🔥🔥");

  //     const res = await fetch("/api/order", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         userId: user?.id,
  //         studentId: user?.studentId,
  //         school: school?.name,
  //         class: products[0]?.class?.name,
  //         totalAmount: grandTotal,
  //         section: products[0]?.class?.sections[0],
  //         academicYear: products[0]?.class?.academicYear,
  //         status: "PENDING"
  //       }),
  //     });
  //     const data = await res.json()
  //     console.log(data, "this is order");
  //   } catch (err) {
  //     console.error("Failed to fetch products", err)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const sendOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 🚨 REQUIRED

    setLoading(true);
    try {
      const className = products[0]?.class?.name;
      const section = products[0]?.class?.sections[0]
      const academicYear = products[0]?.class?.academicYear
      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ REQUIRED
        },
        body: JSON.stringify({
          userId: user?.id,
          studentId: user?.studentId,
          school: school?.name,
          class: className,
          totalAmount: grandTotal,
          section: section,
          academicYear: academicYear,
          status: "PENDING",
        }),
      });

      const data = await res.json();
      console.log("Order response:", data);
    } catch (err) {
      console.error("Failed to create order", err);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    const fetchDetails = async () => {
      const user = await fetch("/api/user/details");
      const resData = await user.json();
      if (resData.success) {
        const { user: userData } = resData;
        console.log(userData);
        setUser(userData);

        setFormData({
          guardianName: userData.name,
          guardianEmail: userData.email,
          guardianPhone: userData.phone,
          address: userData.address
        });
      }
    }
    fetchDetails();
    fetchProducts();
    fetchSchool(schoolId as string)
  }, []);

  useEffect(() => {
    console.log("Address changed:", formData.address, formData.guardianPhone);
    console.log(user);
    console.log(products[0]?.class?.name);



  }, [formData]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* <Button variant="ghost" className="mb-4 sm:mb-6 -ml-2 hover:bg-amber-300 cursor-pointer" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </Button> */}

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1 pb-4 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <CardTitle className="text-2xl sm:text-3xl font-semibold">Guardian Information</CardTitle>
              {/* <div className="flex flex-col items-start sm:items-end">
                <span className="text-sm text-muted-foreground">Selected Plan</span>
                <span className="text-lg sm:text-xl font-semibold text-primary">{planName}</span>
                <span className="text-sm text-muted-foreground">{planPrice}</span>
              </div> */}
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Please provide guardian details to complete your registration
            </p>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6">
            <form onSubmit={sendOrder} className="space-y-4 sm:space-y-5">
              {/* Guardian Name */}
              <div className="space-y-2">
                <Label htmlFor="guardianName" className="text-sm sm:text-base font-medium">
                  Guardian Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <Input
                    disabled
                    id="guardianName"
                    type="text"
                    placeholder="Enter guardian's full name"
                    value={formData.guardianName}
                    onChange={(e) => handleInputChange("guardianName", e.target.value)}
                    className={cn(
                      "pl-10 sm:pl-11 h-11 sm:h-12 text-sm sm:text-base",
                      errors.guardianName && "border-destructive focus-visible:ring-destructive",
                    )}
                  />
                </div>
                {errors.guardianName && <p className="text-sm text-destructive">{errors.guardianName}</p>}
              </div>

              {/* Guardian Phone */}
              <div className="space-y-2">
                <Label htmlFor="guardianPhone" className="text-sm sm:text-base font-medium">
                  Guardian Phone Number <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <Input
                    id="guardianPhone"
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    value={formData.guardianPhone}
                    onChange={(e) => handleInputChange("guardianPhone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className={cn(
                      "pl-10 sm:pl-11 h-11 sm:h-12 text-sm sm:text-base",
                      errors.guardianPhone && "border-destructive focus-visible:ring-destructive",
                    )}
                    maxLength={10}
                  />
                </div>
                {errors.guardianPhone && <p className="text-sm text-destructive">{errors.guardianPhone}</p>}
              </div>

              {/* Guardian Email with OTP */}
              <div className="space-y-2">
                <Label htmlFor="guardianEmail" className="text-sm sm:text-base font-medium">
                  Guardian Email <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    <Input
                      id="guardianEmail"
                      type="email"
                      placeholder="Enter guardian's email"
                      value={formData.guardianEmail}
                      onChange={(e) => handleInputChange("guardianEmail", e.target.value)}
                      className={cn(
                        "pl-10 sm:pl-11 h-11 sm:h-12 text-sm sm:text-base",
                        errors.guardianEmail && "border-destructive focus-visible:ring-destructive",
                      )}
                      disabled
                    />
                    {isVerified && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    )}
                  </div>
                  {/* <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!formData.guardianEmail || loading || isVerified}
                    className="h-11 sm:h-12 px-4 sm:px-6 whitespace-nowrap text-sm sm:text-base w-full sm:w-auto"
                  >
                    {loading ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                  </Button> */}
                </div>
                {errors.guardianEmail && <p className="text-sm text-destructive">{errors.guardianEmail}</p>}

                {/* OTP Input */}
                {/* {otpSent && !isVerified && (
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-muted/50 rounded-lg space-y-3">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Enter the 6-digit OTP sent to{" "}
                      <span className="font-medium text-foreground">{formData.guardianEmail}</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                          if (errors.otp) {
                            setErrors((prev) => ({ ...prev, otp: "" }))
                          }
                        }}
                        className={cn(
                          "h-11 sm:h-12 text-center tracking-widest text-base sm:text-lg font-semibold",
                          errors.otp && "border-destructive focus-visible:ring-destructive",
                        )}
                        maxLength={6}
                      />
                      <Button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={!otp || otp.length !== 6 || loading}
                        className="h-11 sm:h-12 px-4 sm:px-6 whitespace-nowrap text-sm sm:text-base w-full sm:w-auto"
                      >
                        {loading ? "Verifying..." : "Verify OTP"}
                      </Button>
                    </div>
                    {errors.otp && <p className="text-sm text-destructive">{errors.otp}</p>}
                  </div>
                )}

                {isVerified && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/20 p-2 sm:p-3 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    <span>Email verified successfully</span>
                  </div>
                )} */}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm sm:text-base font-medium">
                  Address <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <Textarea
                    id="address"
                    placeholder="Enter complete address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className={cn(
                      "pl-10 sm:pl-11 pt-3 min-h-[100px] sm:min-h-[120px] resize-none text-sm sm:text-base",
                      errors.address && "border-destructive focus-visible:ring-destructive",
                    )}
                    rows={4}
                  />
                </div>
                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
              </div>

              <div className="mt-6 rounded-lg border bg-muted/40 p-4 space-y-5">
                <h3 className="text-lg font-semibold">Order Summary</h3>

                {Object.entries(groupedByCategory).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <div className="font-medium text-sm">{category}</div>

                    {items.map((product) => (
                      <div
                        key={product.id}
                        className="flex justify-between text-sm text-muted-foreground pl-3"
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
                    className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium cursor-pointer bg-amber-400 hover:bg-amber-300 text-black"
                    size="lg"
                  >
                    Place Order
                  </Button>
                </div>
              ) : (
                <div className="pt-2 sm:pt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    You don’t have any children in this school or the fees haven’t been paid.
                  </p>
                </div>
              )}

            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-4 sm:mt-6 border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-100">
              <strong>Note:</strong> Please ensure all information is accurate. The OTP will be sent to the provided
              email address for verification purposes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
