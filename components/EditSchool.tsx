"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Loader2, X, Upload, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type School = {
    id: string
    name: string
    email?: string
    address: string 
    classRange?: string
    languages?: string[]
    image?: string
    board?: string 
}

interface EditSchoolModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    school?: School
    onUpdate?: () => void
}

export function EditSchoolModal({ open, onOpenChange, school, onUpdate }: EditSchoolModalProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("") 
    const [location, setLocation] = useState("")
    
    const [selectedClassRange, setSelectedClassRange] = useState<string>("")
    const [selectedBoard, setSelectedBoard] = useState<string>("")
    const [selectedLangs, setSelectedLangs] = useState<string[]>([])
    
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)

    const [newLang, setNewLang] = useState("")
    const [isLangDialogOpen, setIsLangDialogOpen] = useState(false)

    useEffect(() => {
        if (school && open) {
            setName(school.name || "")
            setEmail(school.email || "")
            setLocation(school.address || "")
            setSelectedClassRange(school.classRange || "")
            setSelectedBoard(school.board || "")
            setSelectedLangs(school.languages || [])
            setLogoPreview(school.image || null)
            setImageFile(null) 
            setPassword("") 
        }
    }, [school, open])

    const addLanguage = () => {
        const trimmed = newLang.trim()
        if (!trimmed) return
        if (!selectedLangs.includes(trimmed)) {
            setSelectedLangs(prev => [...prev, trimmed])
        }
        setNewLang("")
        setIsLangDialogOpen(false)
    }

    const removeLanguage = (lang: string) => {
        setSelectedLangs(prev => prev.filter(l => l !== lang))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!school) return
        setLoading(true)

        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("email", email)
            formData.append("location", location)
            
            if (password) formData.append("password", password)
                
            formData.append("classRange", selectedClassRange)
            formData.append("board", selectedBoard)
            formData.append("languages", JSON.stringify(selectedLangs))

            if (imageFile) {
                formData.append("image", imageFile)
            }

            const res = await fetch(`/api/admin/schools/${school.id}`, {
                method: "PUT",
                body: formData,
            })

            const json = await res.json()
            if (!res.ok) throw new Error(json.message || "Update failed")

            toast({ title: "Success", description: "School updated successfully" })
            onOpenChange(false)
            onUpdate?.()

        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl">Edit School</DialogTitle>
                    <DialogDescription>
                        Update the school details below.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column: Basic Info */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">School Name</Label>
                                <Input id="edit-name" value={name} onChange={e => setName(e.target.value)} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-email">School Email</Label>
                                <Input id="edit-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-password">New Password</Label>
                                <Input 
                                    id="edit-password" 
                                    type="password" 
                                    placeholder="Leave blank to keep current" 
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-location">Location</Label>
                                <Input id="edit-location" value={location} onChange={e => setLocation(e.target.value)} required />
                            </div>
                        </div>

                        {/* Right Column: Configuration & Logo */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Classes</Label>
                                    <Select value={selectedClassRange} onValueChange={setSelectedClassRange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="upto-8">Upto 8</SelectItem>
                                            <SelectItem value="upto-10">Upto 10</SelectItem>
                                            <SelectItem value="upto-12">Upto 12</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Board</Label>
                                    <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Board" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ICSE">ICSE</SelectItem>
                                            <SelectItem value="CBSE">CBSE</SelectItem>
                                            <SelectItem value="TSBIE">TSBIE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>School Logo</Label>
                                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 transition-colors hover:bg-muted/50 group relative min-h-[140px]">
                                    {logoPreview ? (
                                        <div className="relative w-full h-32">
                                            <img src={logoPreview} alt="Preview" className="w-full h-full object-contain" />
                                            <button
                                                type="button"
                                                onClick={() => { setLogoPreview(null); setImageFile(null) }}
                                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label htmlFor="edit-logo-upload" className="flex flex-col items-center cursor-pointer w-full">
                                            <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                                            <span className="text-sm text-muted-foreground">Upload JPG/PNG</span>
                                            <input
                                                id="edit-logo-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) {
                                                        setImageFile(file)
                                                        setLogoPreview(URL.createObjectURL(file))
                                                    }
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Languages Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-base">Medium of Instruction</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsLangDialogOpen(true)}
                                className="h-8 text-xs"
                            >
                                <Plus className="w-3 h-3 mr-1" /> Add Language
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {selectedLangs.map(lang => (
                                <div key={lang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium border">
                                    {lang}
                                    <button type="button" onClick={() => removeLanguage(lang)} className="hover:text-destructive transition-colors">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Inner Dialog for Adding Language */}
                    <Dialog open={isLangDialogOpen} onOpenChange={setIsLangDialogOpen}>
                        <DialogContent className="sm:max-w-[400px]">
                            <DialogHeader>
                                <DialogTitle>Add Language</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <Input
                                    placeholder="e.g. Hindi, Spanish"
                                    value={newLang}
                                    onChange={(e) => setNewLang(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setIsLangDialogOpen(false)}>Cancel</Button>
                                <Button type="button" onClick={addLanguage}>Add Language</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </form>

                <DialogFooter className="p-6 pt-2 bg-muted/20 border-t">
                    <Button variant="ghost" type="button" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={(e) => {
                        // Manual form submission trigger
                        const form = document.querySelector('form')
                        form?.requestSubmit()
                    }} className="min-w-[120px]" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}