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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
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

export default function AddUserDialog({
    schoolId,
    classId,
    sectionId,
    onStudentAdded
}: Props) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [parentExists, setParentExists] = useState<boolean | null>(null)

    const { toast } = useToast()

    const [formData, setFormData] = useState({
        name: "",
        rollNo: "",
        classId: classId || "",
        section: sectionId || "",
        parentEmail: "",
        password: "",
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
    }

    const checkParentEmail = async () => {
        if (!formData.parentEmail) return

        try {
            const res = await fetch(
                `/api/admin/check-parent?email=${encodeURIComponent(formData.parentEmail)}`
            )
            const data = await res.json()
            setParentExists(data.exists)
        } catch {
            setParentExists(null)
        }
    }

    const validateForm = () => {
        const newErrors: FormErrors = {}

        if (!formData.name.trim()) newErrors.name = "Name is required"
        if (!formData.rollNo.trim()) newErrors.rollNo = "Roll Number is required"
        if (!formData.classId.trim()) newErrors.classId = "Class is required"
        if (!formData.section.trim()) newErrors.section = "Section is required"

        if (!formData.parentEmail.trim()) {
            newErrors.parentEmail = "Parent Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
            newErrors.parentEmail = "Invalid email format"
        }

        // 🔐 Password required ONLY if parent does NOT exist
        if (parentExists === false && !formData.password.trim()) {
            newErrors.password = "Password is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        try {
            const res = await fetch("/api/admin/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (data.success) {
                toast({
                    title: "Success",
                    description: "Student created successfully"
                })
                setOpen(false)
                onStudentAdded?.()
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Failed to create student",
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
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
                    {/* Name & Roll No */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Student Name *</Label>
                            <Input name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Roll Number *</Label>
                            <Input name="rollNo" value={formData.rollNo} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Class & Section */}
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

                    {/* Parent Email */}
                    <div>
                        <Label>Parent Email *</Label>
                        <Input
                            name="parentEmail"
                            type="email"
                            value={formData.parentEmail}
                            onChange={handleChange}
                            onBlur={checkParentEmail}
                        />
                    </div>

                    {/* Password – conditional */}
                    {parentExists === false && (
                        <div>
                            <Label>Password *</Label>
                            <Input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {/* DOB, Gender, Blood Group */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Date of Birth</Label>
                            <Input
                                name="dob"
                                type="date"
                                value={formData.dob}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <Label>Gender</Label>
                            <Select
                                value={formData.gender}
                                onValueChange={v => handleSelectChange("gender", v)}
                            >
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

                        <div>
                            <Label>Blood Group</Label>
                            <Input
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                placeholder="A+, O-, etc"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <Label>Address</Label>
                        <Input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
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
