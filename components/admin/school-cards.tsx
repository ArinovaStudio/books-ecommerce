"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Search, MapPin, Users, GraduationCap } from "lucide-react"

const schools = [
    {
        id: 1,
        name: "Lincoln High School",
        location: "New York, NY",
        students: 1250,
        teachers: 85,
        status: "Active",
        established: "1998",
    },
    {
        id: 2,
        name: "Riverside Academy",
        location: "Los Angeles, CA",
        students: 890,
        teachers: 62,
        status: "Active",
        established: "2005",
    },
    {
        id: 3,
        name: "Oakwood Elementary",
        location: "Chicago, IL",
        students: 450,
        teachers: 35,
        status: "Active",
        established: "2010",
    },
]

type Props = {
    onSelectSchool: (school: { id: number; name: string }) => void
}

export function SchoolCards({ onSelectSchool }: Props) {
    return (
        <div className="space-y-4 cursor-pointer">
            {/* Search */}
            < div className="flex items-center gap-2" >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search schools..." className="pl-9" />
                </div>
            </div >

            {/* Cards Grid */}
            < div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" >
                {
                    schools.map((school) => (
                        <Card
                            key={school.id}
                            onClick={() => onSelectSchool({ id: school.id, name: school.name })}
                            className="relative">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-base">{school.name}</CardTitle>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
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
                                    <Badge variant={school.status === "Active" ? "default" : "secondary"}>
                                        {school.status}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        Est. {school.established}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                }
            </div >
        </div>
    )
}
