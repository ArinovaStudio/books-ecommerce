"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
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
import { ImageIcon } from "lucide-react"

type School = {
    id: number
    name: string
    email: string
    location: string
    classes: string
    languages: string[]
    logoUrl?: string
}

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    school?: School
    onUpdate?: (updatedSchool: School) => void
}

export function EditSchoolModal({ open, onOpenChange, school, onUpdate }: Props) {
    const [email, setEmail] = useState(school?.email || "")
    const [name, setName] = useState(school?.name || "")
    const [location, setLocation] = useState(school?.location || "")
    const [classes, setClasses] = useState(school?.classes || "")
    const [selectedLangs, setSelectedLangs] = useState<string[]>(school?.languages || [])
    const [logoPreview, setLogoPreview] = useState<string | null>(school?.logoUrl || null)

    useEffect(() => {
        setEmail(school?.email || "")
        setName(school?.name || "")
        setLocation(school?.location || "")
        setClasses(school?.classes || "")
        setSelectedLangs(school?.languages || [])
        setLogoPreview(school?.logoUrl || null)
    }, [school])

    const toggleLanguage = (lang: string) => {
        setSelectedLangs((prev) =>
            prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
        )
    }

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault()
    //     const updatedSchool: School = {
    //         ...school,
    //         email,
    //         name,
    //         location,
    //         classes,
    //         languages: selectedLangs,
    //         logoUrl: logoPreview || school.logoUrl,
    //     }
    //     // if (onUpdate) onUpdate(updatedSchool)
    //     onOpenChange(false)
    // }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                <DialogContent className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-6 shadow-lg focus:outline-none">
                    <div className="mb-6">
                        <DialogTitle className="text-xl font-semibold">Edit School</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Update the details of the school
                        </DialogDescription>
                    </div>

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* LEFT: Inputs */}
                        <div className="grid grid-cols gap-4">
                            <div className="grid gap-2">
                                <Label>School Email</Label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="px-3 py-2 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>School Name</Label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="px-3 py-2 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                                    required
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 space-y-2">
                                    <Label>Classes</Label>
                                    <Select value={classes} onValueChange={setClasses}>
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

                                <div className="flex-[2] space-y-3">
                                    <Label>Languages</Label>
                                    <div className="flex flex-wrap gap-1">
                                        {["English", "Hindi", "Telugu"].map((lang) => {
                                            const isChecked = selectedLangs.includes(lang)
                                            return (
                                                <label key={lang} className={`flex items-center gap-2 rounded-xl border px-4 py-2 cursor-pointer transition-all ${isChecked ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-input hover:bg-muted"}`}>
                                                    <Checkbox checked={isChecked} onCheckedChange={() => toggleLanguage(lang)} />
                                                    <span className="text-sm font-medium">{lang}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Location</Label>
                                <input
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="px-3 py-2 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* RIGHT: Logo */}
                        <div className="flex flex-col gap-2">
                            <Label>School Logo</Label>
                            <label htmlFor="logo" className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer hover:bg-muted/50 transition min-h-[180px] h-full">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo preview" className="h-32 w-full object-contain" />
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
                                    if (file) setLogoPreview(URL.createObjectURL(file))
                                }}
                            />
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t col-span-full">
                            <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" className="px-8">Update School</Button>
                        </div>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}
