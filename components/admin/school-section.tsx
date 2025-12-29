"use client"

import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Card, CardHeader, CardTitle } from "../ui/card"
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react"
import { Input } from "../ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "../ui/dialog"

import { useToast } from "../ui/use-toast"

const sortSections = (a: string, b: string) => {
    const order = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    const aIndex = order.indexOf(a.toUpperCase())
    const bIndex = order.indexOf(b.toUpperCase())
    return aIndex - bIndex
}


/* ================= TYPES ================= */

type SectionType = {
    id: string
    name: string
}

type Props = {
    school: string
    classes: string
    onSelectSection?: (section: string) => void
    onBack?: () => void
}

/* ================= COMPONENT ================= */

export default function SchoolSection({
    onSelectSection,
    onBack,
    school,
    classes,
}: Props) {
    const { toast } = useToast();
    const [sections, setSections] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newSection, setNewSection] = useState("")


    /* ================= FETCH SECTIONS ================= */

    const fetchSection = async () => {
        // if (!school || !classes) return
        setLoading(true)
        try {
            const res = await fetch(
                `/api/admin/classes/${classes}/sections`
            )
            const data = await res.json()
            console.log("data = ", data.sections)

            if (data.success) {
                setSections(data.sections.sort(sortSections))
                toast({
                    title: "Success",
                    description: "Section added successfully",
                    variant: "default"
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add section",
                variant: "destructive"
            })
            setSections([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSection()
    }, [school, classes])

    /* ================= ADD SECTION ================= */

    const handleAddSection = async () => {
        if (!newSection.trim()) return

        setLoading(true)
        try {
            const res = await fetch(
                `/api/admin/classes/${classes}/sections`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ section: newSection.toUpperCase() }),
                }
            )

            const data = await res.json()

            if (data.success) {
                fetchSection()
            }
        } catch (error) {
            console.error("Add section error:", error)
        } finally {
            setLoading(false)
            setIsDialogOpen(false)
            setNewSection("")
        }
    }

    /* ================= DELETE SECTION ================= */

    const deleteSection = async (
        e: React.MouseEvent,
        sectionToDelete: string
    ) => {
        e.stopPropagation()

        try {
            const res = await fetch(
                `/api/admin/classes/${classes}/sections`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ section: sectionToDelete }),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Delete failed")
            }

            if (data.success) {
                toast({
                    title: "Success",
                    description: "Section deleted successfully",
                    variant: "default"
                })
                fetchSection()
            }
        } catch (error) {
            console.error("Delete section error:", error)
        }
    }

    /* ================= UI ================= */

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                {onBack && (
                    <Button variant="ghost" onClick={onBack} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to classes
                    </Button>
                )}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Section
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Section</DialogTitle>
                        </DialogHeader>

                        <Input
                            placeholder="e.g. A, B, C"
                            value={newSection}
                            onChange={(e) => setNewSection(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
                        />

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleAddSection}>Add</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Sections Grid */}
            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : sections.length === 0 ? (
                <p className="text-center text-muted-foreground">
                    No sections found
                </p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {sections.map((sec) => (
                        <Card
                            key={sec}
                            onClick={
                                onSelectSection
                                    ? () => onSelectSection(sec)
                                    : undefined
                            }
                            className="group relative cursor-pointer hover:shadow-md"
                        >
                            <button
                                onClick={(e) => deleteSection(e, sec)}
                                className="absolute top-2 right-2 cursor-pointer p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>

                            <CardHeader>
                                <CardTitle className="text-center">{sec}</CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
