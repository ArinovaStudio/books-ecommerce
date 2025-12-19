"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, MapPin, Users, GraduationCap, Pencil, Trash } from "lucide-react"
import { EditSchoolModal } from "../EditSchool"

type School = {
    id: number
    name: string
    location: string
    students: number
    teachers: number
    status: "Active" | "Pending"
    established: string
    email?: string
    classes?: string
    languages?: string[]
    logoUrl?: string
}

const schools: School[] = [
    { id: 1, name: "Lincoln High School", location: "New York, NY", students: 1250, teachers: 85, status: "Active", established: "1998" },
    { id: 2, name: "Riverside Academy", location: "Los Angeles, CA", students: 890, teachers: 62, status: "Active", established: "2005" },
    { id: 3, name: "Oakwood Elementary", location: "Chicago, IL", students: 450, teachers: 35, status: "Active", established: "2010" },
]

type Props = {
    onSelectSchool: (school: { id: number; name: string }) => void
}

export function SchoolCards({ onSelectSchool }: Props) {
    const [editingSchool, setEditingSchool] = useState<School | null>(null)
    const [open, setOpen] = useState(false)

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Input placeholder="Search schools..." className="pl-9" />
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {schools.map((school) => (
                    <Card
                        key={school.id}
                        className="relative cursor-pointer hover:shadow-md"
                        onClick={() => onSelectSchool({ id: school.id, name: school.name })}
                    >
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-base">{school.name}</CardTitle>

                                {/* Dropdown Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end" className="w-36">
                                        <DropdownMenuItem
                                            className="gap-2 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setEditingSchool(school)
                                                setOpen(true) // open modal
                                            }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            className="gap-2 text-destructive cursor-pointer"
                                            onClick={() => console.log("Delete", school.id)}
                                        >
                                            <Trash className="h-4 w-4 text-red-400" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {school.location}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    Students
                                </div>
                                <span className="font-medium">{school.students.toLocaleString()}</span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                    Teachers
                                </div>
                                <span className="font-medium">{school.teachers}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${school.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {school.status}
                                </span>
                                <span className="text-sm text-muted-foreground">Est. {school.established}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit School Modal */}
            {editingSchool && (
                <EditSchoolModal
                    school={editingSchool}
                    open={open}
                    onOpenChange={(val) => {
                        setOpen(val)
                        if (!val) setEditingSchool(null) // clear editing school when modal closes
                    }}
                />
            )}
        </div>
    )
}
