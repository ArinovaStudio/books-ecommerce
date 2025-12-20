"use client"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Search, Mail, User, ArrowLeft, Plus } from "lucide-react"

const users = [
    { id: 1, name: "Alex Johnson", email: "alex@example.com", role: "Student", status: "Active", joinDate: "2024-01-15" },
    { id: 2, name: "Sarah Williams", email: "sarah@example.com", role: "Teacher", status: "Active", joinDate: "2024-02-20" },
    { id: 3, name: "Michael Brown", email: "michael@example.com", role: "Student", status: "Active", joinDate: "2024-03-10" },
    { id: 4, name: "Emma Davis", email: "emma@example.com", role: "Teacher", status: "Inactive", joinDate: "2024-01-05" },
    { id: 5, name: "James Wilson", email: "james@example.com", role: "Student", status: "Active", joinDate: "2024-04-12" }
]

type Props = {
    className: string
    onBack: () => void
}

export function SchoolClassUsers({ className, onBack }: Props) {

    return (
        <div className="space-y-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Classes
            </Button>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-9" />
            </div>

            {/* Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                    <Card key={user.id} className="relative hover:shadow-md transition">
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    {user.name}
                                </CardTitle>

                                {/* <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button> */}
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
        </div>
    )
}
