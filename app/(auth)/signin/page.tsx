"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface FormErrors {
    [key: string]: string
}

const SignInPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})

    const router = useRouter()
    const { toast } = useToast()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors: FormErrors = {}

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format'
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()
            console.log("\ndata = ", data)

            if (data.success) {
                toast({
                    title: "Success",
                    description: "Signed in successfully",
                })

                const roleRoutes: Record<string, string> = {
                    ADMIN: "/admin",
                    SUB_ADMIN: "/subadmin",
                    USER: "/",
                }

                router.push(roleRoutes[data.user.role] ?? "/")
            }
            else {
                toast({
                    title: 'Error',
                    description: data.message || 'Invalid credentials',
                    variant: 'destructive'
                })
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong. Please try again.',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-full flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-8">
                    <h1 className="text-3xl text-center font-bold text-gray-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-600 text-sm">
                        To keep connected with us please login with your personal information by email address and password
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Address
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Justin@ghostlamp.io"
                                className={`pl-10 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''
                                    }`}
                            />
                            {!errors.email && formData.email && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••••"
                                className={`pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-blue-600">
                            Forgot Password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            'Login Now'
                        )}
                    </Button>
                    <div className="text-center">
                        <span className="text-sm text-gray-600">Don&apos;t have an account? </span>
                        <Link
                            href="/signup"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Create account
                        </Link>
                    </div>


                </form>
            </div>
        </div>
    )
}

export default SignInPage