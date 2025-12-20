"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogPortal, DialogOverlay } from "@radix-ui/react-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageIcon, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type School = {
    id: string
    name: string
    email?: string 
    address: string
    classRange?: string
    languages?: string[]
    image?: string
}

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    school?: School
    onUpdate?: () => void 
}

export function EditSchoolModal({ open, onOpenChange, school, onUpdate }: Props) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [location, setLocation] = useState("")
    const [classes, setClasses] = useState("")
    const [selectedLangs, setSelectedLangs] = useState<string[]>([])
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)

    useEffect(() => {
        if (school) {
            setEmail(school.email || "")
            setName(school.name || "")
            setLocation(school.address || "")
            setClasses(school.classRange || "upto-10") 
            setSelectedLangs(school.languages || [])
            setLogoPreview(school.image || null)
        }
    }, [school])

    const toggleLanguage = (lang: string) => {
        setSelectedLangs((prev) =>
            prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
        )
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
            formData.append("classes", classes)
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
            
            if (onUpdate) onUpdate()

        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                <DialogContent className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-6 shadow-lg focus:outline-none max-h-[90vh] overflow-y-auto">
                    
                    <div className="mb-6">
                        <DialogTitle className="text-xl font-semibold">Edit School</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">Update details</DialogDescription>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Inputs */}
                        <div className="grid grid-cols gap-4">
                            <div className="grid gap-2">
                                <Label>School Email</Label>
                                <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="px-3 py-2 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
                            </div>
                            <div className="grid gap-2">
                                <Label>School Name</Label>
                                <input name="name" value={name} onChange={(e) => setName(e.target.value)} className="px-3 py-2 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 space-y-2">
                                    <Label>Classes</Label>
                                    <Select value={classes} onValueChange={setClasses}>
                                        <SelectTrigger className="rounded-xl h-10"><SelectValue placeholder="Select class" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="upto-8">Upto 8</SelectItem>
                                            <SelectItem value="upto-10">Upto 10</SelectItem>
                                            <SelectItem value="upto-12">Upto 12</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex-[2] space-y-3">
                                    <Label>Languages</Label>
                                    <div className="flex flex-wrap gap-1">
                                        {["English", "Hindi", "Telugu"].map((lang) => {
                                            const isChecked = selectedLangs.includes(lang)
                                            return (
                                                <label key={lang} className={`flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer transition-all text-xs ${isChecked ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-input hover:bg-muted"}`}>
                                                    <Checkbox checked={isChecked} onCheckedChange={() => toggleLanguage(lang)} />
                                                    <span>{lang}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Location</Label>
                                <input name="location" value={location} onChange={(e) => setLocation(e.target.value)} className="px-3 py-2 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none" required />
                            </div>
                        </div>

                        {/* Logo */}
                        <div className="flex flex-col gap-2">
                            <Label>School Logo</Label>
                            <label htmlFor="edit-logo" className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer hover:bg-muted/50 transition min-h-[180px] h-full">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo preview" className="h-32 w-full object-contain" />
                                ) : (
                                    <div className="flex flex-col items-center text-muted-foreground"><ImageIcon className="h-10 w-10 mb-2 opacity-50" /><span className="text-xs text-center">Click to change</span></div>
                                )}
                            </label>
                            <input id="edit-logo" type="file" accept="image/*" className="hidden" onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) { setImageFile(file); setLogoPreview(URL.createObjectURL(file)) }
                            }} />
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t col-span-full">
                            <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" className="px-8" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update School
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}