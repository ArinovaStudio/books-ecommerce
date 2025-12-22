"use client"

import { useState } from "react"
import {
    Dialog,
    DialogTrigger, 
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogPortal,
    DialogOverlay,
} from "@radix-ui/react-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Checkbox } from "@radix-ui/react-checkbox"
import { Plus, ImageIcon, Pencil, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AddSchoolModalProps {
    onSchoolAdded?: () => void;
}

export function AddSchoolModal({ onSchoolAdded }: AddSchoolModalProps) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
    const [selectedClassRange, setSelectedClassRange] = useState<string>("");

    const toggleLanguage = (lang: string) => {
        setSelectedLangs((prev) =>
            prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!selectedClassRange) {
                throw new Error("Please select a class range");
            }

            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);

            formData.append("classRange", selectedClassRange);
            formData.append("languages", JSON.stringify(selectedLangs));
            
            if (imageFile) {
                formData.append("image", imageFile);
            }

    
            const res = await fetch("/api/admin/schools", {
                method: "POST",
                body: formData,
            })

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Failed to create school");
            }

            toast({ title: "Success", description: "School added successfully" });;
            setOpen(false);

            if (onSchoolAdded) onSchoolAdded();

        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className={`gap-2 cursor-pointer`}>
                    <Plus className="h-4 w-4" />
                    Add School
                </Button>
            </DialogTrigger>

            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

                <DialogContent className="fixed left-1/2 top-1/2 z-50 
                    w-[95vw] max-w-4xl 
                    -translate-x-1/2 -translate-y-1/2 
                    rounded-xl border bg-background p-6 shadow-lg focus:outline-none"
                >
                    <div className="mb-6">
                        <DialogTitle className="text-xl font-semibold">
                            Add School
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Enter the details of the new school
                        </DialogDescription>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Main Grid: 3 Columns on desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* LEFT: Inputs (Spans 2 columns) */}
                            <div className="grid grid-cols gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">School Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="school@gmail.com"
                                        className="px-3 py-2 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="********"
                                        className="px-3 py-2 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">School Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Green Valley High"
                                        className="px-3 py-2 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Classes - Added flex-1 to keep sizing consistent */}
                                    <div className="flex-1 space-y-2">
                                        <Label className="text-sm font-medium">Classes</Label>
                                        <Select onValueChange={setSelectedClassRange}>
                                            <SelectTrigger className="rounded-xl h-10">
                                                <SelectValue placeholder="Select class" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="upto-8">Upto 8</SelectItem>
                                                <SelectItem value="upto-10">Upto 10</SelectItem>
                                                <SelectItem value="upto-12">Upto 12</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Languages */}
                                    <div className="flex-[2] space-y-3">
                                        <Label className="text-sm font-medium">Languages</Label>
                                        <div className="flex flex-wrap gap-1">
                                            {["English", "Hindi", "Telugu"].map((lang) => {
                                                const isChecked = selectedLangs.includes(lang)
                                                return (
                                                    <label
                                                        key={lang}
                                                        htmlFor={lang}
                                                        className={`flex items-center gap-2 rounded-xl border px-4 py-2 cursor-pointer transition-all
                                                        ${isChecked
                                                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                                : "border-input hover:bg-muted"
                                                            }`}
                                                    >
                                                        <Checkbox
                                                            id={lang}
                                                            checked={isChecked}
                                                            onCheckedChange={() => toggleLanguage(lang)}
                                                        />
                                                        <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            {lang}
                                                        </span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>


                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Location</label>
                                    <input
                                        name="location"
                                        type="text"
                                        placeholder="Mumbai, Maharashtra"
                                        className="px-3 py-2 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* RIGHT: Logo Upload (Spans 1 column) */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium">School Logo</span>
                                <label
                                    htmlFor="logo"
                                    className="flex flex-col items-center justify-center 
                                    border-2 border-dashed rounded-xl p-4 cursor-pointer 
                                    hover:bg-muted/50 transition min-h-[180px] h-full"
                                >
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="Logo preview"
                                            className="h-32 w-full object-contain"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center text-muted-foreground">
                                            <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                                            <span className="text-xs text-center">Click to upload logo</span>
                                        </div>
                                    )}
                                </label>
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
                            </div>
                        </div>

                        {/* Footer: Outside the field grid for full width alignment */}
                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                            <Button 
                                variant="ghost" 
                                className="cursor-pointer" 
                                type="button" 
                                onClick={() => setOpen(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="px-8 cursor-pointer" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save School
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog >
    )
}