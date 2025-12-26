"use client"
import { useEffect, useState, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Mail, User, ArrowLeft, Loader2, Pencil, Trash, ShieldOff, ShieldCheck } from "lucide-react"
import AddUserDialog, { StudentType } from "../AddUser"
import EditUserDialog from "../EditUserDialog" 
import { useToast } from "@/hooks/use-toast"

interface UserType extends StudentType {
    id: string
    email:string
    role: string
    status: string
    joinDate: string
    isActive?: boolean
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
    
    const [editingStudent, setEditingStudent] = useState<UserType | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const { toast } = useToast()

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/students?classId=${classId}&section=${sectionId}`)
            const data = await res.json()

            if (data.success) {
                setUsers(data.students.map((student: any) => ({
                    id: student.id,
                    name: student.name,
                    rollNo: student.rollNo,
                    classId: student.classId,
                    section: student.section,
                    email: student.parent?.email || student.parentEmail,
                    parentEmail: student.parent?.email || student.parentEmail,
                    phone: student.parent?.phone || "",
                    role: "User",
                    isActive: student.isActive,
                    status: student.isActive ? "Active" : "Inactive",
                    joinDate: new Date(student.createdAt).toLocaleDateString(),
                    dob: student.dob,
                    gender: student.gender,
                    bloodGroup: student.bloodGroup,
                    address: student.address
                })))
            } else {
                setUsers([])
            }
        } catch (error) {
            console.error("Failed to fetch users", error)
            toast({ title: "Error", description: "Failed to fetch students", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }, [classId, sectionId, toast])

    useEffect(() => {
        if (classId && sectionId) fetchUsers()
    }, [fetchUsers, classId, sectionId])

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this student?")) return
        try {
            const res = await fetch(`/api/admin/students/${userId}`, { method: "DELETE" })
            const data = await res.json()
            if (data.success) {
                setUsers(prev => prev.filter(u => u.id !== userId))
                toast({ title: "Deleted", description: "Student deleted successfully" })
            } else {
                toast({ title: "Error", description: data.message || "Failed to delete student", variant: "destructive" })
            }
        } catch (error) {
            console.error(error)
            toast({ title: "Error", description: "Failed to delete student", variant: "destructive" })
        }
    }

    const handleToggleStatus = async (user: UserType) => {
        const newStatus = !user.isActive 
        const actionName = newStatus ? "activate" : "deactivate"
        
        if (!confirm(`Are you sure you want to ${actionName} this student?`)) return

        try {
            const res = await fetch(`/api/admin/students/${user.id}/toggle`, { 
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: newStatus })
            })
            const data = await res.json()
            
            if (data.success) {
                setUsers(prev => prev.map(u => u.id === user.id ? { 
                    ...u, 
                    isActive: newStatus, 
                    status: newStatus ? "Active" : "Inactive" 
                } : u))
                toast({ title: "Success", description: `Student ${actionName}d successfully` })
            } else {
                toast({ title: "Error", description: data.message || "Failed to update status", variant: "destructive" })
            }
        } catch (error) {
            console.error(error)
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" })
        }
    }

    const handleEditClick = (user: UserType) => {
        setEditingStudent(user)
        setIsEditOpen(true)
    }

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
                    onStudentAdded={fetchUsers} 
                />

                {editingStudent && (
                    <EditUserDialog 
                        student={editingStudent}
                        open={isEditOpen}
                        onOpenChange={(open) => {
                            setIsEditOpen(open)
                            if(!open) setEditingStudent(null)
                        }}
                        onStudentUpdated={fetchUsers}
                    />
                )}
            </div>

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
                    {filteredUsers.map((user) => (
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

                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem 
                                                    className="gap-2 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleEditClick(user)
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4" /> Edit
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    className={`gap-2 cursor-pointer ${user.isActive ? 'text-destructive' : 'text-green-600'}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleToggleStatus(user)
                                                    }}
                                                >
                                                    {user.isActive ? (
                                                        <><ShieldOff className="h-4 w-4" /> Deactivate</>
                                                    ) : (
                                                        <><ShieldCheck className="h-4 w-4" /> Activate</>
                                                    )}
                                                </DropdownMenuItem>
                                                
                                                <DropdownMenuItem
                                                    className="gap-2 text-destructive cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDelete(user.id)
                                                    }}
                                                >
                                                    <Trash className="h-4 w-4" /> Delete
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
                                    <Badge variant={user.status === "Active" ? "default" : "destructive"}>
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