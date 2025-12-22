"use state";
import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardHeader, CardTitle } from "../ui/card"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Input } from "../ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "../ui/dialog"

type SectionType = {
    id: string
    name: string
}

type Props = {
    section?: {
        id: string
        name: string
    }
    school: string,
    classes: string,
    onSelectSection?: (section: SectionType) => void
    onBack?: () => void
}

export default function SchoolSection({ onSelectSection, onBack, school, classes }: Props) {
    const [sections, setSections] = useState<SectionType[]>([
        {
            id: "A",
            name: "A"
        },
        {
            id: "B",
            name: "B"
        },
        {
            id: "C",
            name: "C"
        },
        {
            id: "D",
            name: "D"
        }
    ])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newSection, setNewSection] = useState<string>("")



    const handleAddSection = () => {
        const section = newSection.trim().toUpperCase()
        if (!section) return

        const exists = sections.some(sec => sec.id === section)
        if (exists) {
            setNewSection("")
            setIsDialogOpen(false)
            return
        }

        setSections([
            ...sections,
            { id: section, name: section }
        ])

        setNewSection("")
        setIsDialogOpen(false)
    }

    const deleteSection = (e: React.MouseEvent, sectionToDelete: string) => {
        e.stopPropagation()
        setSections(sections.filter((sec) => sec.id !== sectionToDelete))
    }

    return (
        <div >
            <div className="flex justify-between items-center mb-4">
                <Button variant="ghost" onClick={onBack} className="gap-2 cursor-pointer">
                    <ArrowLeft className="h-4 w-4" />
                    Back to classes
                </Button>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2 cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Add Section
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Section</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <Input
                                placeholder="e.g. A, D, E ..."
                                value={newSection}
                                onChange={(e) => setNewSection(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSection()}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" className="cursor-pointer" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="cursor-pointer" onClick={handleAddSection}>Add Section</Button>
                        </DialogFooter>
                    </DialogContent>

                </Dialog>
            </div>

            <div className="grid mt-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {sections.map((sec) => (
                    <Card
                        key={sec.id}
                        onClick={onSelectSection ? () => onSelectSection({ name: sec.name, id: sec.id }) : undefined}
                        className={`group relative transition ${onSelectSection
                            ? "cursor-pointer hover:shadow-md"
                            : "cursor-default"
                            }`}
                    >
                        <button
                            onClick={(e) => deleteSection(e, sec.id)}
                            className="absolute cursor-pointer top-2 right-2 p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        <CardHeader>
                            <CardTitle className="text-center text-base">
                                {sec.name}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div >
    )
}