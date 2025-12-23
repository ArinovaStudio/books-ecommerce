"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FormErrors {
    [key: string]: string
}

interface Props {
    schoolId?: string
    classId?: string
    sectionId?: string
    onStudentAdded?: () => void
}

export default function AddUserDialog({ schoolId, classId, sectionId, onStudentAdded }: Props) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        name: "",
        rollNo: "",
        classId: classId || "",
        section: sectionId || "",
        parentEmail: "",
        dob: "",
        gender: "",
        bloodGroup: "",
        address: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }))
        }
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }))
        }
    }

    const validateForm = () => {
        const newErrors: FormErrors = {}
        
        if (!formData.name.trim()) newErrors.name = "Name is required"
        if (!formData.rollNo.trim()) newErrors.rollNo = "Roll Number is required"
        if (!formData.classId.trim()) newErrors.classId = "Class is required"
        if (!formData.section.trim()) newErrors.section = "Section is required"
        if (!formData.parentEmail.trim()) newErrors.parentEmail = "Parent Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) newErrors.parentEmail = "Invalid email format"
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) return
        
        setLoading(true)
        try {
            const response = await fetch('/api/admin/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            
            const data = await response.json()
            
            if (data.success) {
                toast({
                    title: "Success",
                    description: "Student created successfully",
                    variant: "default"
                })
                setFormData({ name: "", rollNo: "", classId: classId || "", section: sectionId || "", parentEmail: "", dob: "", gender: "", bloodGroup: "", address: "" })
                setOpen(false)
                onStudentAdded?.()
            } else {
                if (data.errors) {
                    const fieldErrors: FormErrors = {}
                    data.errors.forEach((error: any) => {
                        fieldErrors[error.field] = error.message
                    })
                    setErrors(fieldErrors)
                } else {
                    toast({
                        title: "Error",
                        description: data.message || "Failed to create student",
                        variant: "destructive"
                    })
                }
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 cursor-pointer">
                    <UserPlus className="h-4 w-4" />
                    Add New Student
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Student</DialogTitle>
                    <DialogDescription>
                        Enter details to add a new student to the school.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Student Name *</Label>
                            <Input
                                id="name" name="name" 
                                value={formData.name} onChange={handleChange}
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rollNo">Roll Number *</Label>
                            <Input
                                id="rollNo" name="rollNo"
                                value={formData.rollNo} onChange={handleChange}
                                className={errors.rollNo ? "border-red-500" : ""}
                            />
                            {errors.rollNo && <p className="text-sm text-red-500">{errors.rollNo}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="classId">Class ID *</Label>
                            <Input
                                id="classId" name="classId"
                                value={formData.classId} onChange={handleChange}
                                className={errors.classId ? "border-red-500" : ""}
                                disabled={!!classId}
                            />
                            {errors.classId && <p className="text-sm text-red-500">{errors.classId}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="section">Section *</Label>
                            <Input
                                id="section" name="section"
                                value={formData.section} onChange={handleChange}
                                className={errors.section ? "border-red-500" : ""}
                                disabled={!!sectionId}
                            />
                            {errors.section && <p className="text-sm text-red-500">{errors.section}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="parentEmail">Parent Email *</Label>
                        <Input
                            id="parentEmail" name="parentEmail" type="email"
                            value={formData.parentEmail} onChange={handleChange}
                            className={errors.parentEmail ? "border-red-500" : ""}
                        />
                        {errors.parentEmail && <p className="text-sm text-red-500">{errors.parentEmail}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input
                                id="dob" name="dob" type="date"
                                value={formData.dob} onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <Select value={formData.gender} onValueChange={(v) => handleSelectChange("gender", v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bloodGroup">Blood Group</Label>
                            <Input
                                id="bloodGroup" name="bloodGroup"
                                value={formData.bloodGroup} onChange={handleChange}
                                placeholder="A+, B-, O+, etc."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address" name="address"
                            value={formData.address} onChange={handleChange}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button variant="default" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Student"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}