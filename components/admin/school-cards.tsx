"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, MapPin, Users, GraduationCap, Pencil, Trash, Loader2 } from "lucide-react"
import { EditSchoolModal } from "../EditSchool"
import { AddSchoolModal } from "../addSchoolModal"
import { PromoteUserDialog } from "../PromoteUser"
import { useToast } from "@/hooks/use-toast"

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

type SelectableItem = {
    id: string
    name: string
}

type Props = {
    activeTab: string
    onSelectSchool: (school: SelectableItem) => void
    refreshTrigger?: number
}

export function SchoolCards({ activeTab, onSelectSchool, refreshTrigger = 0 }: Props) {
    const { toast } = useToast();
    const [schools, setSchools] = useState<School[]>([])
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
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
        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/admin/schools/${schoolId}`, { method: "DELETE" });
            const json = await res.json();

            if (json.success) {
                setSchools(prev => prev.filter(s => s.id !== schoolId));
                toast({
                    title: "Success",
                    description: "School deleted successfully",
                    variant: "default"
                })
            } else {
                toast({
                    title: "Error",
                    description: json.message,
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.error("Delete failed", error);
            toast({
                title: "Error",
                description: "Failed to delete school",
                variant: "destructive"
            })
        } finally {
            setDeleteLoading(false);
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
                {activeTab === "schools" ? <AddSchoolModal onSchoolAdded={() => setLocalRefresh(prev => prev + 1)} /> : <PromoteUserDialog />}
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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {schools.map((school) => (
                        <Card
                            onClick={() =>
                                onSelectSchool(school)
                            }
                            key={school.id}
                            className="relative cursor-pointer hover:shadow-md transition-shadow"
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">

                                    <div
                                        className="flex gap-3 cursor-pointer"

                                    >
                                        {school.image ? (
                                            <img
                                                src={school.image}
                                                alt={school.name}
                                                className="h-10 w-10 rounded-full object-cover border"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {school.name.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}

                                        <div>
                                            <CardTitle className="text-base">{school.name}</CardTitle>
                                            <p className="text-xs text-muted-foreground">
                                                {school.board || "General Board"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* 🔹 ACTION MENU */}
                                    {activeTab === "schools" && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="cursor-pointer"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
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

                                                <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <div className="flex gap-2 items-center">
                                                                <Trash className="h-4 w-4" /> Delete
                                                            </div>
                                                        </DialogTrigger>

                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>
                                                                    Are you sure you want to delete this School?
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                    This action cannot be undone.
                                                                </DialogDescription>
                                                            </DialogHeader>

                                                            <DialogFooter>
                                                                <DialogClose asChild>
                                                                    <Button variant="outline">Cancel</Button>
                                                                </DialogClose>

                                                                <Button
                                                                    variant="destructive"
                                                                    className="cursor-pointer"
                                                                    onClick={() => handleDelete(school.id)}
                                                                >
                                                                    {deleteLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : "Delete"}
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>

                                <div
                                    className="flex items-center gap-2 text-sm text-muted-foreground mt-2 cursor-pointer"
                                    onClick={() =>
                                        onSelectSchool(school)
                                    }
                                >
                                    <MapPin className="h-4 w-4" />
                                    <span className="truncate max-w-[200px]">
                                        {typeof school.address === "string"
                                            ? school.address
                                            : "Unknown Location"}
                                    </span>
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
                                    <span className="font-medium">
                                        {school.numberOfClasses || 0}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${school.status === "ACTIVE"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
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
            )
            }

            {/* Edit School Modal */}
            {
                editingSchool && (
                    <EditSchoolModal
                        school={editingSchool}
                        open={open}
                        onOpenChange={(val) => {
                            setOpen(val)
                            if (!val) setEditingSchool(null)
                        }}
                        onUpdate={() => setLocalRefresh(prev => prev + 1)}
                    />
                )
            }
        </div >
    )
}