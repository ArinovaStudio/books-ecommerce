"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Student = {
    id: string
    name: string
    rollNo: string
    section: string
    parentEmail: string
    parent: {
      name: string,
      email: string
    },
    firstLanguage?: string
    dob?: string
    gender?: string
    bloodGroup?: string
}

type Props = {
    open: boolean
    onClose: () => void
    student: Student
    classId: string
    schoolId: string // New Prop
    onUpdated: () => void
}

export default function EditStudentDialog({
    open,
    onClose,
    student,
    classId,
    schoolId,
    onUpdated
}: Props) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([])

    const [form, setForm] = useState({
        name: "",
        rollNo: "",
        section: "",
        firstLanguage: "",
        parentEmail: "",
        parentName: "",
        dob: "",
        gender: "",
        bloodGroup: "",
    })

    // Fetch Languages
    useEffect(() => {
        if (open && schoolId) {
            const fetchLanguages = async () => {
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
            fetchLanguages()
        }
    }, [open, schoolId])

    useEffect(() => {
        if (student) {
            setForm({
                name: student.name,
                rollNo: student.rollNo,
                section: student.section,
                firstLanguage: student.firstLanguage || "",
                parentEmail: student.parent.email || student.parentEmail || "",
                parentName: student.parent.name || "",
                dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : "",
                gender: student.gender || "",
                bloodGroup: student.bloodGroup || "",
            })
        }
    }, [student])

    const resolveSectionId = async () => {
        const res = await fetch(
            `/api/admin/sections?classId=${classId}&name=${form.section}`
        )
        const data = await res.json()
        if (!data.success) throw new Error("Invalid section")
        return data.section.id
    }

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.rollNo.trim() || !form.parentEmail.trim()) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields (Name, Roll No, Parent Email)",
                variant: "destructive"
            })
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(form.parentEmail)) {
            toast({
                title: "Validation Error",
                description: "Please enter a valid email address",
                variant: "destructive"
            })
            return
        }

        setLoading(true)
        try {
            const sectionId = await resolveSectionId()

            const payload = {
                name: form.name.trim(),
                rollNo: form.rollNo.trim(),
                sectionId,
                firstLanguage: form.firstLanguage || null,
                parentEmail: form.parentEmail.trim(),
                parentName: form.parentName.trim() || null,
                dob: form.dob || null,
                gender: form.gender || null,
                bloodGroup: form.bloodGroup || null,
            }

            const res = await fetch(`/api/admin/students/${student.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            const data = await res.json()
            if (!data.success) throw new Error(data.message || "Failed to update student")

            toast({
                title: "Success",
                description: "Student updated successfully"
            })
            onUpdated()
            onClose()
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Failed to update student",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Student</DialogTitle>
                </DialogHeader>

                <div className="grid no-scrollbar gap-4 py-4 max-h-[400px] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Name *</Label>
                            <Input
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label>Roll No *</Label>
                            <Input
                                value={form.rollNo}
                                onChange={e => setForm({ ...form, rollNo: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Section</Label>
                            <Input value={form.section} disabled className="bg-gray-100" />
                        </div>

                        <div>
                            <Label>First Language</Label>
                            <Select 
                                value={form.firstLanguage} 
                                onValueChange={(val) => setForm({ ...form, firstLanguage: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableLanguages.map((lang) => (
                                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Parent Name</Label>
                            <Input
                                value={form.parentName}
                                onChange={e => setForm({ ...form, parentName: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Parent Email *</Label>
                            <Input
                                type="email"
                                value={form.parentEmail}
                                onChange={e => setForm({ ...form, parentEmail: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Date of Birth</Label>
                            <Input
                                type="date"
                                value={form.dob}
                                onChange={e => setForm({ ...form, dob: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Gender</Label>
                            <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Blood Group</Label>
                            <Select value={form.bloodGroup} onValueChange={(v) => setForm({ ...form, bloodGroup: v })}>
                                <SelectTrigger>
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
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Updating...
                            </>
                        ) : (
                            "Update Student"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}