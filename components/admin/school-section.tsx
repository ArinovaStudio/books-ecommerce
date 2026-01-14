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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../ui/select"
import { Label } from "../ui/label"
import { useToast } from "../ui/use-toast"


type Section = {
    id: string
    name: string
    language: string
}

type Props = {
    schoolId: string
    school: string 
    classes: { id: string, name: string }
    onSelectSection?: (section: { id: string, name: string }) => void
    onBack?: () => void
}


const sortSections = (a: Section, b: Section) => {
    const order = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    const aIndex = order.indexOf(a.name.toUpperCase())
    const bIndex = order.indexOf(b.name.toUpperCase())
    
    if (aIndex === -1 || bIndex === -1) {
        return a.name.localeCompare(b.name)
    }
    return aIndex - bIndex
}


export default function SchoolSection({
    schoolId,
    onSelectSection,
    onBack,
    school,
    classes
}: Props) {
    const { toast } = useToast();
    
    const [sections, setSections] = useState<Section[]>([])
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    
    const [newSection, setNewSection] = useState("")
    const [firstLanguage, setFirstLanguage] = useState("")


    const fetchSection = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                `/api/admin/classes/${classes.id}/sections`
            )
            const data = await res.json()

            if (data.success) {
                setSections((data.sections as Section[]).sort(sortSections))
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch sections",
                variant: "destructive"
            })
            setSections([])
        } finally {
            setLoading(false)
        }
    }

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

    useEffect(() => {
        if (school && classes.id) {
            fetchSection()
            fetchLanguages()
        }
    }, [school, classes])


    const handleAddSection = async () => {
        if (!newSection.trim() || !firstLanguage) return

        setLoading(true)
        try {
            const res = await fetch(
                `/api/admin/classes/${classes.id}/sections`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        section: newSection.toUpperCase(),
                        language: firstLanguage 
                    }),
                }
            )

            const data = await res.json()

            if (data.success) {
                toast({
                    title: "Success",
                    description: "Section added successfully",
                    variant: "default"
                })
                fetchSection()
                setIsDialogOpen(false)
                setNewSection("")
                setFirstLanguage("")
            } else {
                 throw new Error(data.message)
            }
        } catch (error: any) {
            console.error("Add section error:", error)
            toast({
                title: "Error",
                description: error.message || "Failed to add section",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const deleteSection = async (
        e: React.MouseEvent,
        sectionId: string 
    ) => {
        e.stopPropagation()

        try {
            const res = await fetch(
                `/api/admin/classes/${classes.id}/sections`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sectionId }),
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
        } catch (error: any) {
            console.error("Delete section error:", error)
            toast({
                title: "Error",
                description: error.message || "Failed to delete section",
                variant: "destructive"
            })
        }
    }


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

                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle>Add New Section</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="section">Section Name *</Label>
                                <Input
                                    id="section"
                                    placeholder="e.g. A, B, C"
                                    value={newSection}
                                    onChange={(e) => setNewSection(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
                                    className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                            
                            {/* Select Dropdown */}
                            <div className="space-y-2">
                                <Label htmlFor="firstLanguage">First Language *</Label>
                                <Select
                                    value={firstLanguage}
                                    onValueChange={setFirstLanguage}
                                >
                                    <SelectTrigger className="w-full border-2 border-gray-200 focus:ring-2 focus:ring-blue-200">
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
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsDialogOpen(false)
                                    setNewSection("")
                                    setFirstLanguage("")
                                }}
                                className="border-2 border-gray-200"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleAddSection}
                                disabled={!newSection.trim() || !firstLanguage}
                            >
                                Add Section
                            </Button>
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
                            key={sec.id} 
                            onClick={
                                onSelectSection
                                    ? () => onSelectSection({ id: sec.id, name: sec.name }) 
                                    : undefined
                            }
                            className="group relative cursor-pointer hover:shadow-md transition-all"
                        >
                            <button
                                onClick={(e) => deleteSection(e, sec.id)} 
                                className="absolute top-2 right-2 cursor-pointer p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>

                            <CardHeader className="flex flex-col items-center justify-center space-y-1 py-6">
                                <CardTitle className="text-center text-xl">{sec.name}</CardTitle>
                                <span className="text-sm text-muted-foreground font-medium">
                                    {sec.language}
                                </span>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}