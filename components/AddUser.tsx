"use client"

import { useEffect, useState } from "react"
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

interface StudentType {
    id?: string
    name: string
    rollNo: string
    classId: string
    section: string
    parentEmail: string
    parentName: string
    firstLanguage: string
    password?: string
    dob?: string
    gender?: string
    bloodGroup?: string
}

type ClassType = {
    id: string, name: string
}

interface Props {
    schoolId?: string
    classItem?: ClassType
    sectionId?: string
    student?: StudentType // optional: if provided, we are editing
    onStudentAdded?: () => void
    onStudentUpdated?: () => void
}

export default function AddUserDialog({
    schoolId,
    classItem,
    sectionId,
    student,
    onStudentAdded,
    onStudentUpdated
}: Props) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [checkPasswordLoading, setCheckPasswordLoading] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [parentExists, setParentExists] = useState<boolean | null>(null)
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([]) // Dynamic Languages

    const { toast } = useToast()

    const classId = classItem?.id

    const [formData, setFormData] = useState<StudentType>({
        name: "",
        rollNo: "",
        classId: classId || "",
        section: sectionId || "",
        parentEmail: "",
        parentName: "",
        firstLanguage: "",
        password: "",
        dob: "",
        gender: "",
        bloodGroup: "",
    })

    // Fetch Dynamic Languages
    const fetchLanguages = async () => {
        if (!schoolId) return
        try {
            const res = await fetch(`/api/admin/schools/${schoolId}/languages`)
            const data = await res.json()
            if (data.success && Array.isArray(data.languages)) {
                setAvailableLanguages(data.languages)
            }
        } catch (error) {
            console.error("Failed to fetch languages", error)
        }
    }

    // Prefill form when editing
    useEffect(() => {
        fetchLanguages() // Fetch languages on mount

        if (student) {
            setFormData({
                name: student.name || "",
                rollNo: student.rollNo || "",
                classId: student.classId || classId || "",
                section: student.section || sectionId || "",
                parentEmail: student.parentEmail || "",
                parentName: student.parentName || "",
                firstLanguage: student.firstLanguage || "",
                password: student.password || "",
                dob: student.dob || "",
                gender: student.gender || "",
                bloodGroup: student.bloodGroup || "",
            })
        } else {
            setFormData(prev => ({
                ...prev,
                classId: classId || "",
                section: sectionId || ""
            }))
        }
    }, [student, classId, sectionId, schoolId])

    const generatePassword = () => {
        const pwd = Math.random().toString(36).slice(-8)
        setFormData(prev => ({ ...prev, password: pwd }))
    }

    const copyPassword = async () => {
        await navigator.clipboard.writeText(formData.password || "")
        toast({ title: "Copied", description: "Password copied to clipboard" })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target

        let finalValue = value

        if (type === "number") {
            if (value === "") {
                finalValue = ""
            } else {
                const num = Number(value)
                finalValue = isNaN(num) || num < 0 ? "0" : value
            }
        }

        setFormData(prev => ({ ...prev, [name]: finalValue }))

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

    const checkParentEmail = async () => {
        if (!formData.parentEmail) return
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
        if (!formData.classId.trim()) newErrors.classId = "Class is required"
        if (!formData.section.trim()) newErrors.section = "Section is required"
        if (!formData.parentEmail.trim()) {
            newErrors.parentEmail = "Parent Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
            newErrors.parentEmail = "Invalid email format"
        }
        if (!formData.parentName.trim()) newErrors.parentName = "Parent Name is required"
        if (!formData.firstLanguage.trim()) newErrors.firstLanguage = "First Language is required"
        
        if (parentExists === false && !formData.password?.trim()) {
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
            // 🔥 Convert section name → sectionId
            const resolvedSectionId = await getSectionIdByName(
                classId!,
                formData.section
            )

            const payload = {
                ...formData,
                classId,
                sectionId: resolvedSectionId, // ✅ UUID
            }

            delete (payload as any).section // optional cleanup

            const res = await fetch("/api/admin/students", {
                method: student ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            const data = await res.json()

            if (data.success) {
                toast({
                    title: "Success",
                    description: student
                        ? "Student updated successfully"
                        : "Student created successfully",
                })

                setOpen(false)
                student ? onStudentUpdated?.() : onStudentAdded?.()
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Something went wrong",
                    variant: "destructive",
                })
            }
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Failed to create student",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }


    const getSectionIdByName = async (classId: string, sectionName: string) => {
        const res = await fetch(
            `/api/admin/sections?classId=${classId}&name=${sectionName}`
        )
        const data = await res.json()
        if (!data.success || !data.section) {
            throw new Error("Section not found")
        }

        return data.section.id
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    {student ? "Edit Student" : <><UserPlus className="h-4 w-4" /> Add New Student</>}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{student ? "Edit Student" : "Add Student"}</DialogTitle>
                    <DialogDescription>
                        {student ? "Update student details." : "Enter details to add a new student to the school."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Name & Roll No */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-foreground">Student Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="text-foreground"
                                placeholder="Enter student name"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rollNo" className="text-sm font-medium text-foreground">Roll Number *</Label>
                            <Input
                                id="rollNo"
                                type="number"
                                name="rollNo"
                                value={formData.rollNo}
                                min={0}
                                onChange={handleChange}
                                className="text-foreground"
                                placeholder="Enter roll number"
                            />
                            {errors.rollNo && <p className="text-sm text-red-500">{errors.rollNo}</p>}
                        </div>
                    </div>

                    {/* Class & Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="classId" className="text-sm font-medium text-foreground">Class *</Label>
                            <Input
                                id="classId"
                                name="classId"
                                value={classItem?.name}
                                disabled
                                className="text-foreground"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="section" className="text-sm font-medium text-foreground">Section *</Label>
                            <Input
                                id="section"
                                name="section"
                                value={formData.section}
                                disabled
                                className="text-foreground"
                            />
                        </div>
                    </div>

                    {/* Parent Name & First Language */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="parentName" className="text-sm font-medium text-foreground">Parent Name *</Label>
                            <Input
                                id="parentName"
                                name="parentName"
                                value={formData.parentName}
                                onChange={handleChange}
                                className="text-foreground"
                                placeholder="Enter parent name"
                            />
                            {errors.parentName && <p className="text-sm text-red-500">{errors.parentName}</p>}
                        </div>
                        
                        {/* Dynamic Language Select */}
                        <div className="space-y-2">
                            <Label htmlFor="firstLanguage" className="text-sm font-medium text-foreground">First Language *</Label>
                            <Select 
                                value={formData.firstLanguage} 
                                onValueChange={(value) => handleSelectChange("firstLanguage", value)}
                            >
                                <SelectTrigger className="text-foreground">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableLanguages.length > 0 ? (
                                        availableLanguages.map((lang) => (
                                            <SelectItem key={lang} value={lang}>
                                                {lang}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="p-2 text-sm text-muted-foreground text-center">
                                            No languages found
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.firstLanguage && <p className="text-sm text-red-500">{errors.firstLanguage}</p>}
                        </div>
                    </div>

                    {/* Parent Email */}
                    <div className="space-y-2">
                        <Label htmlFor="parentEmail" className="text-sm font-medium">Parent Email *</Label>
                        <div className="flex gap-2">
                            <Input
                                id="parentEmail"
                                name="parentEmail"
                                type="email"
                                value={formData.parentEmail}
                                onChange={handleChange}
                                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 flex-1"
                                placeholder="Enter parent email"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={checkParentEmail}
                                disabled={checkPasswordLoading || !formData.parentEmail}
                                className="border-2 border-gray-200"
                            >
                                {checkPasswordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
                            </Button>
                        </div>
                        {errors.parentEmail && <p className="text-sm text-red-500">{errors.parentEmail}</p>}
                        {parentExists === true && (
                            <p className="text-sm text-green-600">✓ Parent account exists</p>
                        )}
                        {parentExists === false && (
                            <p className="text-sm text-orange-600">⚠ Parent account doesn't exist. Password will be required.</p>
                        )}
                    </div>

                    {/* Password (only if parent doesn't exist) */}
                    {parentExists === false && (
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">Password *</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="password"
                                    name="password"
                                    type="text"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 flex-1"
                                    placeholder="Enter password"
                                />
                                <Button type="button" variant="outline" onClick={generatePassword} className="border-2 border-gray-200">
                                    Generate
                                </Button>
                                <Button type="button" variant="outline" onClick={copyPassword} disabled={!formData.password} className="border-2 border-gray-200">
                                    Copy
                                </Button>
                            </div>
                            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                        </div>
                    )}

                    {/* Optional Fields (DOB, Gender, BloodGroup) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dob" className="text-sm font-medium">Date of Birth</Label>
                            <Input
                                id="dob"
                                name="dob"
                                type="date"
                                value={formData.dob}
                                onChange={handleChange}
                                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                            <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                                <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bloodGroup" className="text-sm font-medium">Blood Group</Label>
                            <Select value={formData.bloodGroup} onValueChange={(value) => handleSelectChange("bloodGroup", value)}>
                                <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                    <SelectValue placeholder="Select blood group" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A+">A+</SelectItem>
                                    <SelectItem value="A-">A-</SelectItem>
                                    <SelectItem value="B+">B+</SelectItem>
                                    <SelectItem value="B-">B-</SelectItem>
                                    <SelectItem value="AB+">AB+</SelectItem>
                                    <SelectItem value="AB-">AB-</SelectItem>
                                    <SelectItem value="O+">O+</SelectItem>
                                    <SelectItem value="O-">O-</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="pt-6">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-2 border-gray-200">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="min-w-[120px]">
                            {loading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {student ? "Updating..." : "Adding..."}</>
                            ) : (
                                student ? "Update Student" : "Add Student"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}