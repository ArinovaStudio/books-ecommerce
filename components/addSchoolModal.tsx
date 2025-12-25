"use client"

import { useState } from "react"
import {
    Dialog,
    DialogTrigger,
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

import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Plus, ImageIcon, Loader2, X, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

interface AddSchoolModalProps {
    onSchoolAdded?: () => void;
}

export function AddSchoolModal({ onSchoolAdded }: AddSchoolModalProps) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [selectedLangs, setSelectedLangs] = useState<string[]>(["English", "Telugu"]);
    const [selectedBoard, setSelectedBoard] = useState<string>("");
    const [selectedClassRange, setSelectedClassRange] = useState<string>("");

    const [newLang, setNewLang] = useState("")
    const [isLangDialogOpen, setIsLangDialogOpen] = useState(false)

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
        e.preventDefault();
        setLoading(true);

        try {
            if (!selectedClassRange) throw new Error("Please select a class range");

            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);

            formData.append("classRange", selectedClassRange);
            formData.append("languages", JSON.stringify(selectedLangs));
            formData.append("board", selectedBoard);

            if (imageFile) formData.append("image", imageFile);

            const res = await fetch("/api/admin/schools", {
                method: "POST",
                body: formData,
            })

            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to create school");

            toast({ title: "Success", description: "School added successfully" });
            setOpen(false);
            onSchoolAdded?.();

        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 shadow-sm cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Add School
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl">Add New School</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to register a new school in the system.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column: Basic Info */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">School Name</Label>
                                <Input id="name" name="name" placeholder="Green Valley High" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">School Email</Label>
                                <Input id="email" name="email" type="email" placeholder="admin@school.com" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Access Password</Label>
                                <Input id="password" name="password" type="password" placeholder="••••••••" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" name="location" placeholder="City, State" required />
                            </div>
                        </div>

                        {/* Right Column: Configuration & Logo */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Classes</Label>
                                    <Select onValueChange={setSelectedClassRange} required>
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
                                    <Select onValueChange={setSelectedBoard} required>
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
                                        <label htmlFor="logo" className="flex flex-col items-center cursor-pointer w-full">
                                            <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                                            <span className="text-sm text-muted-foreground">Upload JPG/PNG</span>
                                            <input
                                                id="logo"
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

                    {/* Languages Section - Full Width */}
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
                    <Button variant="ghost" type="button" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={(e) => {
                        // Manual trigger for form since button is outside form tags in some layouts
                        const form = document.querySelector('form')
                        form?.requestSubmit()
                    }} className="min-w-[120px]" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create School"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}