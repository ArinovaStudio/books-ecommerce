"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, EyeOff, Mail, Lock, User, Phone, Users, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface FormErrors {
    [key: string]: string
}

interface Student {
    name: string
    class: string
}

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        numberOfStudents: ''
    })
    const [students, setStudents] = useState<Student[]>([])
    const [showPassword, setShowPassword] = useState(false)
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

    const handleStudentNumberChange = (value: string) => {
        const num = parseInt(value)
        setFormData(prev => ({ ...prev, numberOfStudents: value }))

        const newStudents: Student[] = []
        for (let i = 0; i < num; i++) {
            newStudents.push({
                name: students[i]?.name || '',
                class: students[i]?.class || ''
            })
        }
        setStudents(newStudents)

        const newErrors = { ...errors }
        Object.keys(newErrors).forEach(key => {
            if (key.startsWith('student_')) {
                delete newErrors[key]
            }
        })
        setErrors(newErrors)
    }

    const handleStudentChange = (index: number, field: 'name' | 'class', value: string) => {
        const newStudents = [...students]
        newStudents[index] = { ...newStudents[index], [field]: value }
        setStudents(newStudents)

        const errorKey = `student_${index}_${field}`
        if (errors[errorKey]) {
            setErrors(prev => ({ ...prev, [errorKey]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors: FormErrors = {}

        if (!formData.name.trim()) newErrors.name = 'Name is required'
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format'
        }
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required'
        } else if (formData.phone.length < 10) {
            newErrors.phone = 'Phone must be at least 10 digits'
        }
        if (!formData.address.trim()) newErrors.address = 'Address is required'
        if (!formData.numberOfStudents) newErrors.numberOfStudents = 'Number of students is required'

        students.forEach((student, index) => {
            if (!student.name.trim()) {
                newErrors[`student_${index}_name`] = `Student ${index + 1} name is required`
            }
            if (!student.class.trim()) {
                newErrors[`student_${index}_class`] = `Student ${index + 1} class is required`
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)
        try {
            const response = await fetch('/api/auth/register/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    students
                })
            })

            const data = await response.json()

            if (data.success) {
                toast({
                    title: 'Success',
                    description: 'Account created successfully',
                    variant: 'default'
                })
                router.push('/signin')
            } else {
                if (data.errors) {
                    const fieldErrors: FormErrors = {}
                    data.errors.forEach((error: any) => {
                        fieldErrors[error.field] = error.message
                    })
                    setErrors(fieldErrors)
                } else {
                    toast({
                        title: 'Error',
                        description: data.message || 'Failed to create account',
                        variant: 'destructive'
                    })
                }
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
        <div className="h-full overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                        <p className="text-gray-600 text-sm">
                            Join us today! Please fill in your information to create your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-2">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-5" />
                                    <Input
                                        id="name" name="name" value={formData.name} onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className={`pl-10 h-7  rounded-xl ${errors.name ? 'border-red-500' : ''}`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-5" />
                                    <Input
                                        id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                                        placeholder="Enter your email"
                                        className={`pl-10 h-7 rounded-xl ${errors.email ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-5" />
                                    <Input
                                        id="password" name="password" type={showPassword ? 'text' : 'password'}
                                        value={formData.password} onChange={handleChange}
                                        placeholder="Create a password"
                                        className={`pl-10 pr-10 h-7 rounded-xl ${errors.password ? 'border-red-500' : ''}`}
                                    />
                                    <button
                                        type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-5" /> : <Eye className="h-4 w-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-5" />
                                    <Input
                                        id="phone" name="phone" value={formData.phone} onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        className={`pl-10 h-7 rounded-xl ${errors.phone ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
                                <Input
                                    id="address" name="address" value={formData.address} onChange={handleChange}
                                    placeholder="Enter your address"
                                    className={`h-7 rounded-xl ${errors.address ? 'border-red-500' : ''}`}
                                />
                                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Number of Students</Label>
                                <Select value={formData.numberOfStudents} onValueChange={handleStudentNumberChange}>
                                    <SelectTrigger className={`h-7 rounded-xl ${errors.numberOfStudents ? 'border-red-500' : ''}`}>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-5 text-gray-400" />
                                            <SelectValue placeholder="Select number of students" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 5].map(num => (
                                            <SelectItem key={num} value={num.toString()}>{num} Student{num > 1 ? 's' : ''}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.numberOfStudents && <p className="text-sm text-red-500">{errors.numberOfStudents}</p>}
                            </div>
                        </div>

                        {students.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800">Students Information</h3>
                                {students.map((student, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-xl space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-gray-700">Student {index + 1}</h4>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label className="text-sm text-gray-600">Student Name</Label>
                                                <Input
                                                    value={student.name}
                                                    onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
                                                    placeholder="Enter student name"
                                                    className={`h-10 rounded-lg ${errors[`student_${index}_name`] ? 'border-red-500' : ''}`}
                                                />
                                                {errors[`student_${index}_name`] && (
                                                    <p className="text-xs text-red-500">{errors[`student_${index}_name`]}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm text-gray-600">Class</Label>
                                                <Input
                                                    value={student.class}
                                                    onChange={(e) => handleStudentChange(index, 'class', e.target.value)}
                                                    placeholder="e.g., Class 5"
                                                    className={`h-10 rounded-lg ${errors[`student_${index}_class`] ? 'border-red-500' : ''}`}
                                                />
                                                {errors[`student_${index}_class`] && (
                                                    <p className="text-xs text-red-500">{errors[`student_${index}_class`]}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button
                            type="submit" disabled={loading}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </Button>

                        <div className="text-center">
                            <span className="text-sm text-gray-600">Already have an account? </span>
                            <Link href="/signin" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage