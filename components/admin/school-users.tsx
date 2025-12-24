"use client"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Mail, User, ArrowLeft, Plus, Loader2, Pencil, Trash, ShieldOff } from "lucide-react"
import AddUserDialog from "../AddUser"

type UserType = {
    id: string
    name: string
    email: string
    phone: string
    role: string
    status: string
    joinDate: string
}

type Props = {
    schoolId: string
    activeTab: string
    classId: string
    sectionId: string
    className?: string
    onBack: () => void
}

export function SchoolClassUsers({ schoolId, activeTab, classId, sectionId, className, onBack }: Props) {
    const [users, setUsers] = useState<UserType[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/admin/schools/${schoolId}/classes/${classId}`)
                const data = await res.json()

                if (data.success) {
                    console.log("users", data.users)
                    setUsers(data.users)
                } else {
                    setUsers([])
                }
            } catch (error) {
                console.error("Failed to fetch users", error)
            } finally {
                setLoading(false)
            }
        }

        if (schoolId && classId) {
            fetchUsers()
        }
    }, [schoolId, classId])


    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={onBack} className="gap-2 cursor-pointer">
                    <ArrowLeft className="h-4 w-4" />
                    <p className="hidden md:block">Back to Section</p>
                </Button>
                <AddUserDialog
                    schoolId={schoolId}
                    classId={classId}
                    sectionId={sectionId}
                    onStudentAdded={() => window.location.reload()}
                />
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground border-2 border-dashed rounded-xl">
                    No users linked to students in {className}.
                </div>
            ) : (

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {users.map((user) => (
                        <Card key={user.id} className="relative hover:shadow-md transition">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        {user.name}
                                    </CardTitle>

                                    {activeTab === "users" && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="cursor-pointer" size="icon" onClick={(e) => e.stopPropagation()}>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end" className="w-36">
                                                <DropdownMenuItem
                                                    className="gap-2 cursor-pointer"
                                                // onClick={(e) => {
                                                //     e.stopPropagation()
                                                //     // setEditingSchool(school)
                                                //     // setOpen(true)
                                                // }}
                                                >
                                                    <Pencil className="h-4 w-4" /> Edit
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    className="gap-2 text-destructive cursor-pointer"
                                                // onClick={(e) => {
                                                //     e.stopPropagation()
                                                //     handleDelete(school.id)
                                                // }}
                                                >
                                                    <Trash className="h-4 w-4 text-red-400" /> Delete
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    className="gap-2 text-destructive cursor-pointer"
                                                // onClick={(e) => {
                                                //     e.stopPropagation()
                                                //     handleDelete(school.id)
                                                // }}
                                                >
                                                    <ShieldOff className="h-4 w-4 text-red-400" /> Deactivate
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    {user.email}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Role</span>
                                    <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                                        {user.role}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span>Status</span>
                                    <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                                        {user.status}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Joined</span>
                                    <span>{user.joinDate}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

        </div>
    )
}
