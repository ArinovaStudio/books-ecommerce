"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StudentType {
    id?: string
    name: string
    rollNo: string
    classId: string
    section: string
    parentEmail: string
    password?: string
    dob?: string
    gender?: string
    bloodGroup?: string
    address?: string
}

interface FormErrors {
    [key: string]: string
}

interface EditProps {
    student: StudentType
    open: boolean
    onOpenChange: (open: boolean) => void
    onStudentUpdated: () => void
}

export default function EditUserDialog({
    student,
    open,
    onOpenChange,
    onStudentUpdated
}: EditProps) {
    const [loading, setLoading] = useState(false)
    const [checkPasswordLoading, setCheckPasswordLoading] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    
    const [parentExists, setParentExists] = useState<boolean | null>(null)
    const [originalEmail, setOriginalEmail] = useState("")

    const { toast } = useToast()

    const [formData, setFormData] = useState<StudentType>({
        name: "",
        rollNo: "",
        classId: "",
        section: "",
        parentEmail: "",
        password: "",
        dob: "",
        gender: "",
        bloodGroup: "",
        address: ""
    })

    useEffect(() => {
        if (student && open) {
            setFormData({
                id: student.id,
                name: student.name || "",
                rollNo: student.rollNo || "",
                classId: student.classId || "",
                section: student.section || "",
                parentEmail: student.parentEmail || "",
                password: "", 
                dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : "",
                gender: student.gender || "",
                bloodGroup: student.bloodGroup || "",
                address: student.address || ""
            })
            setOriginalEmail(student.parentEmail || "")
            setParentExists(null) 
            setErrors({})
        }
    }, [student, open])

    const generatePassword = () => {
        const pwd = Math.random().toString(36).slice(-8)
        setFormData(prev => ({ ...prev, password: pwd }))
    }

    const copyPassword = async () => {
        await navigator.clipboard.writeText(formData.password || "")
        toast({ title: "Copied", description: "Password copied to clipboard" })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))

        if (name === "parentEmail") {
            if (value === originalEmail) {
                setParentExists(null) 
            } else {
                setParentExists(null) 
            }
        }
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const checkParentEmail = async () => {
        if (!formData.parentEmail || formData.parentEmail === originalEmail) {
            setParentExists(null)
            return
        }

        setCheckPasswordLoading(true)
        try {
            const res = await fetch(`/api/admin/check-parent?email=${encodeURIComponent(formData.parentEmail)}`)
            const data = await res.json()
            setParentExists(data.exists)
        } catch {
            setParentExists(null)
        } finally {
            setCheckPasswordLoading(false)
        }
    }

    const validateForm = () => {
        const newErrors: FormErrors = {}
        if (!formData.name.trim()) newErrors.name = "Name is required"
        if (!formData.rollNo.trim()) newErrors.rollNo = "Roll Number is required"
        if (!formData.parentEmail.trim()) {
            newErrors.parentEmail = "Parent Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
            newErrors.parentEmail = "Invalid email format"
        }

        if (formData.parentEmail !== originalEmail && parentExists === false && !formData.password?.trim()) {
            newErrors.password = "Password is required for new parent"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        try {
            const res = await fetch(`/api/admin/students/${student.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            const data = await res.json()

            if (data.success) {
                toast({ title: "Success", description: "Student updated successfully" })
                onOpenChange(false)
                onStudentUpdated()
            } else {
                toast({ title: "Error", description: data.message || "Something went wrong", variant: "destructive" })
            }
        } catch {
            toast({ title: "Error", description: "Something went wrong", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Student</DialogTitle>
                    <DialogDescription>Update student details.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Student Name *</Label>
                            <Input name="name" value={formData.name} onChange={handleChange} />
                            {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                        </div>
                        <div>
                            <Label>Roll Number *</Label>
                            <Input name="rollNo" value={formData.rollNo} onChange={handleChange} />
                            {errors.rollNo && <span className="text-xs text-red-500">{errors.rollNo}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Class *</Label>
                            <Input name="classId" value={formData.classId} disabled />
                        </div>
                        <div>
                            <Label>Section *</Label>
                            <Input name="section" value={formData.section} disabled />
                        </div>
                    </div>

                    <div>
                        <Label>Parent Email *</Label>
                        <div className="relative">
                            <Input
                                name="parentEmail"
                                type="email"
                                value={formData.parentEmail}
                                onChange={handleChange}
                                onBlur={checkParentEmail}
                            />
                            {checkPasswordLoading && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        {errors.parentEmail && <span className="text-xs text-red-500">{errors.parentEmail}</span>}
                        {formData.parentEmail !== originalEmail && parentExists === false && (
                            <span className="text-xs text-blue-600 ml-1">New parent email. Password required.</span>
                        )}
                    </div>

                    {formData.parentEmail !== originalEmail && parentExists === false && (
                        <div>
                            <Label>Password *</Label>
                            <div className="flex gap-2">
                                <Input
                                    name="password"
                                    type="text"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <Button type="button" onClick={() => !formData.password ? generatePassword() : copyPassword()}>
                                    {formData.password ? "Copy" : "Generate"}
                                </Button>
                            </div>
                            {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Date of Birth</Label>
                            <Input name="dob" type="date" value={formData.dob} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Gender</Label>
                            <Select value={formData.gender} onValueChange={v => handleSelectChange("gender", v)}>
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Blood Group</Label>
                            <Input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="A+, O-, etc" />
                        </div>
                    </div>

                    <div>
                        <Label>Address</Label>
                        <Input name="address" value={formData.address} onChange={handleChange} />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : "Update Student"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}