"use client"

import type React from "react"

import { useState,useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Mail, Phone, User, MapPin, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface GuardianFormProps {
  planName: string
  planPrice: string
  onBack: () => void
}

export function GuardianForm({ planName, planPrice, onBack }: GuardianFormProps) {
  const [formData, setFormData] = useState({
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    address: "",
  })

    useEffect(()=>{
      const fetchDetails = async ()=>{
        const user = await fetch("/api/user/details");
        const resData = await user.json();
        if(resData.success){
          const {user:userData} = resData; 
          setFormData({
            guardianName: userData.name,
            guardianEmail: userData.email,
            guardianPhone: userData.phone,
            address: userData.address
          });      
        }
      }
      fetchDetails();
    },[]);
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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
    setOtpSent(true)
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <Button variant="ghost" className="mb-4 sm:mb-6 -ml-2 hover:bg-amber-300 cursor-pointer" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </Button>

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1 pb-4 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <CardTitle className="text-2xl sm:text-3xl font-semibold">Guardian Information</CardTitle>
              <div className="flex flex-col items-start sm:items-end">
                <span className="text-sm text-muted-foreground">Selected Plan</span>
                <span className="text-lg sm:text-xl font-semibold text-primary">{planName}</span>
                <span className="text-sm text-muted-foreground">{planPrice}</span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Please provide guardian details to complete your registration
            </p>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
                    disabled
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
                      disabled={isVerified}
                    />
                    {isVerified && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!formData.guardianEmail || loading || isVerified}
                    className="h-11 sm:h-12 px-4 sm:px-6 whitespace-nowrap text-sm sm:text-base w-full sm:w-auto"
                  >
                    {loading ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                  </Button>
                </div>
                {errors.guardianEmail && <p className="text-sm text-destructive">{errors.guardianEmail}</p>}

                {/* OTP Input */}
                {otpSent && !isVerified && (
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
                )}
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
                    disabled
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

              {/* Submit Button */}
              <div className="pt-2 sm:pt-4">
                <Button type="submit" className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium cursor-pointer bg-amber-400 hover:bg-amber-300 text-black" size="lg">
                  Complete Registration
                </Button>
              </div>
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
