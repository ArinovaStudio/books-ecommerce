"use client"

import { useState, useEffect } from "react" 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, MapPin, Users, GraduationCap, Pencil, Trash, Loader2 } from "lucide-react"
import { EditSchoolModal } from "../EditSchool"

type School = {
    id: string 
    name: string
    address: string | any 
    numberOfClasses?: number
    image?: string
    board?: string
    status: string
    createdAt: string
    _count?: {
        students: number
        teachers?: number 
    }
}

type Props = {
    activeTab: string
    onSelectSchool: (school: { id: string; name: string }) => void 
    refreshTrigger?: number
}

export function SchoolCards({ activeTab, onSelectSchool, refreshTrigger = 0 }: Props) {
    const [schools, setSchools] = useState<School[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [editingSchool, setEditingSchool] = useState<any>(null) 
    const [open, setOpen] = useState(false)
    const [localRefresh, setLocalRefresh] = useState(0)

    useEffect(() => {
        const fetchSchools = async () => {
            setLoading(true)
            try {
                const params = new URLSearchParams()
                if (search) params.append("search", search)
                
                const res = await fetch(`/api/schools?${params.toString()}`)
                const data = await res.json()

                if (data.success) {
                    setSchools(data.schools)
                } else {
                    setSchools([]) 
                }
            } catch (error) {
                console.error("Failed to fetch schools", error)
            } finally {
                setLoading(false)
            }
        }

        const timeoutId = setTimeout(() => {
            fetchSchools()
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [search, refreshTrigger, localRefresh]) 

    const handleDelete = async (schoolId: string) => {
        if (!confirm("Are you sure you want to delete this school? This cannot be undone.")) return;

        try {
            const res = await fetch(`/api/admin/schools/${schoolId}`, { method: "DELETE" });
            const json = await res.json();
            
            if (json.success) {
                setSchools(prev => prev.filter(s => s.id !== schoolId));
            } else {
                alert(json.message);
            }
        } catch (error) {
            console.error("Delete failed", error);
        }
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Input 
                        placeholder="Search schools..." 
                        className="pl-9" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} 
                    />
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : schools.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                    No schools found.
                </div>
            ) : (
                /* Cards Grid */
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {schools.map((school) => (
                        <Card
                            key={school.id}
                            className="relative cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => onSelectSchool({ id: school.id as any, name: school.name })} 
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-3">
                                        {/* Show Logo if available */}
                                        {school.image ? (
                                            <img src={school.image} alt={school.name} className="h-10 w-10 rounded-full object-cover border" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {school.name.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <CardTitle className="text-base">{school.name}</CardTitle>
                                            <p className="text-xs text-muted-foreground">{school.board || "General Board"}</p>
                                        </div>
                                    </div>

                                    {activeTab === "schools" && (
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
                                                        setOpen(true)
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4" /> Edit
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    className="gap-2 text-destructive cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDelete(school.id)
                                                    }}
                                                >
                                                    <Trash className="h-4 w-4 text-red-400" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                    <MapPin className="h-4 w-4" />
                                    <span className="truncate max-w-[200px]">{typeof school.address === 'string' ? school.address : "Unknown Location"}</span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        Students
                                    </div>
                                    <span className="font-medium">{school._count?.students || 0}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                        Classes
                                    </div>
                                    <span className="font-medium">{school.numberOfClasses || 0}</span>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${school.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                        {school.status}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Est. {new Date(school.createdAt).getFullYear()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Edit School Modal */}
            {editingSchool && (
                <EditSchoolModal
                    school={editingSchool}
                    open={open}
                    onOpenChange={(val) => {
                        setOpen(val)
                        if (!val) setEditingSchool(null)
                    }}
                    onUpdate={() => setLocalRefresh(prev => prev + 1)}
                />
            )}
        </div>
    )
}