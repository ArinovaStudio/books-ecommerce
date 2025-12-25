"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  MapPin,
  Calendar,
  Droplets
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface FormErrors {
  [key: string]: string
}

const SignUpPage = ({
  classId,
  sectionId
}: {
  classId?: { id: string }
  sectionId?: string
}) => {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    classId: classId?.id || "",
    section: sectionId || "",
    parentEmail: "",
    password: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    address: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.rollNo.trim()) newErrors.rollNo = "Roll number is required"
    if (!formData.parentEmail.trim())
      newErrors.parentEmail = "Parent email is required"
    else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)
    )
      newErrors.parentEmail = "Invalid email format"

    if (!formData.password.trim())
      newErrors.password = "Password is required"

    if (!formData.dob) newErrors.dob = "Date of birth is required"
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!formData.bloodGroup)
      newErrors.bloodGroup = "Blood group is required"
    if (!formData.address.trim())
      newErrors.address = "Address is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Account created successfully"
        })
        router.push("/signin")
      } else {
        toast({
          title: "Error",
          description: data.message || "Signup failed",
          variant: "destructive"
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-3xl rounded-3xl p-8 md:p-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h1>
          <p className="text-sm text-gray-600">
            Register student details to get started
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-2">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-1">
                <Label>Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Student Name"
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Roll No */}
              <div className="space-y-1">
                <Label>Roll Number</Label>
                <Input
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleChange}
                  placeholder="Roll No"
                  className="h-12 rounded-xl"
                />
                {errors.rollNo && <p className="text-xs text-red-500">{errors.rollNo}</p>}
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-2">
              Account Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Parent Email */}
              <div className="space-y-1">
                <Label>Parent Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    name="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={handleChange}
                    placeholder="parent@email.com"
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
                {errors.parentEmail && (
                  <p className="text-xs text-red-500">{errors.parentEmail}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-12 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-2">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* DOB */}
              <div className="space-y-1">
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="h-12 rounded-xl"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <Label>Gender</Label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full h-12 rounded-xl border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Blood Group */}
              <div className="space-y-1">
                <Label>Blood Group</Label>
                <div className="relative">
                  <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    placeholder="O+"
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1">
            <Label>Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                placeholder="Full address"
                className="w-full rounded-xl border border-gray-200 pl-10 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-medium"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          {/* Already have account */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )

}

export default SignUpPage
