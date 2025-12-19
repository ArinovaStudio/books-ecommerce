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
import { Button } from "./ui/button"
import { Plus, ImageIcon } from "lucide-react"

export function AddSchoolModal() {
    const [logoPreview, setLogoPreview] = useState<string | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle logic
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 cursor-pointer">
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
                                        type="email"
                                        placeholder="school@gmail.com"
                                        className="px-3 py-2 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Password</label>
                                    <input
                                        type="password"
                                        placeholder="********"
                                        className="px-3 py-2 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">School Name</label>
                                    <input
                                        placeholder="Green Valley High"
                                        className="px-3 py-2 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Location</label>
                                    <input
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
                                        if (file) setLogoPreview(URL.createObjectURL(file))
                                    }}
                                />
                            </div>
                        </div>

                        {/* Footer: Outside the field grid for full width alignment */}
                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                            <DialogTrigger asChild>
                                <Button variant="ghost" className="cursor-pointer" type="button">Cancel</Button>
                            </DialogTrigger>
                            <Button type="submit" className="px-8 cursor-pointer">Save School</Button>
                        </div>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog >
    )
}