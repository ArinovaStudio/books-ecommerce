"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Mail, Lock, User, MapPin, School, Upload, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface FormErrors {
  [key: string]: string
}

const SchoolSignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    schoolName: '',
    location: '',
    classes: '',
    board: ''
  })
  const [languages, setLanguages] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const router = useRouter()
  const { toast } = useToast()

  const availableLanguages = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Gujarati', 'Bengali', 'Kannada']
  const classOptions = [
    { value: 'upto-8', label: 'Up to Class 8' },
    { value: 'upto-10', label: 'Up to Class 10' },
    { value: 'upto-12', label: 'Up to Class 12' }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      setLanguages(prev => [...prev, language])
    } else {
      setLanguages(prev => prev.filter(lang => lang !== language))
    }
    if (errors.languages) {
      setErrors(prev => ({ ...prev, languages: '' }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }))
      }
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
    if (!formData.schoolName.trim()) newErrors.schoolName = 'School name is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.classes) newErrors.classes = 'Class range is required'
    if (!formData.board.trim()) newErrors.board = 'Board is required'
    if (languages.length === 0) newErrors.languages = 'At least one language is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      const submitData = new FormData()

      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value)
      })

      submitData.append('languages', JSON.stringify(languages))

      if (imageFile) {
        submitData.append('image', imageFile)
      }

      const response = await fetch('/api/auth/register/sub-admin', {
        method: 'POST',
        body: submitData
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'School registered successfully',
          variant: 'default'
        })
        router.push('/admin')
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to register school',
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
    <div className="h-full overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Register user</h1>
            <p className="text-gray-600 text-sm">
              Create your account and start managing your educational resources
            </p>
          </div>

          {/* <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Admin Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-5" />
                  <Input
                    id="name" name="name" value={formData.name} onChange={handleChange}
                    placeholder="Enter admin name"
                    className={`pl-10 h-7 rounded-xl ${errors.name ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-5" />
                  <Input
                    id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                    placeholder="Enter email address"
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
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">School Information</h3>

              <div className="space-y-2">
                <Label htmlFor="schoolName" className="text-sm font-medium text-gray-700">School Name</Label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-5" />
                  <Input
                    id="schoolName" name="schoolName" value={formData.schoolName} onChange={handleChange}
                    placeholder="Enter school name"
                    className={`pl-10 h-7 rounded-xl ${errors.schoolName ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.schoolName && <p className="text-sm text-red-500">{errors.schoolName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-5" />
                  <Input
                    id="location" name="location" value={formData.location} onChange={handleChange}
                    placeholder="Enter school location"
                    className={`pl-10 h-7 rounded-xl ${errors.location ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">School Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label htmlFor="image" className="cursor-pointer">
                      <div className={`border-2 border-dashed rounded-xl p-4 text-center hover:border-blue-400 transition-colors ${errors.image ? 'border-red-500' : 'border-gray-300'}`}>
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload logo</p>
                      </div>
                    </label>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  {imagePreview && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Class Range</Label>
                <Select value={formData.classes} onValueChange={(v) => handleSelectChange('classes', v)}>
                  <SelectTrigger className={`h-7 rounded-xl ${errors.classes ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select class range" />
                  </SelectTrigger>
                  <SelectContent>
                    {classOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.classes && <p className="text-sm text-red-500">{errors.classes}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="board" className="text-sm font-medium text-gray-700">Board</Label>
                <Input
                  id="board" name="board" value={formData.board} onChange={handleChange}
                  placeholder="e.g., CBSE, ICSE, State Board"
                  className={`h-7 rounded-xl ${errors.board ? 'border-red-500' : ''}`}
                />
                {errors.board && <p className="text-sm text-red-500">{errors.board}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Languages</Label>
                <div className={`grid grid-cols-2 gap-2 p-4 border rounded-xl ${errors.languages ? 'border-red-500' : 'border-gray-200'}`}>
                  {availableLanguages.map(language => (
                    <div key={language} className="flex items-center justify-start text-black space-x-2">
                      <Checkbox
                        id={language}
                        className='text-black border border-gray-500'
                        checked={languages.includes(language)}
                        onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                      />
                      <Label htmlFor={language} className="text-sm text-gray-600">{language}</Label>
                    </div>
                  ))}
                </div>
                {errors.languages && <p className="text-sm text-red-500">{errors.languages}</p>}
              </div>
            </div>

            <Button
              type="submit" disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering School...
                </>
              ) : (
                'Register School'
              )}
            </Button>

            <div className="text-center">
              <span className="text-sm text-gray-600">Already have an account? </span>
              <Link href="/signin" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Sign In
              </Link>
            </div>
          </form> */}
          
        </div>
      </div>
    </div>
  )
}

export default SchoolSignUpPage