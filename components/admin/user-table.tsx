"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Search } from "lucide-react"

const users = [
  { id: 1, name: "Alex Johnson", email: "alex@example.com", role: "Admin", status: "Active", joinDate: "2024-01-15" },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "Teacher",
    status: "Active",
    joinDate: "2024-02-20",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Student",
    status: "Active",
    joinDate: "2024-03-10",
  },
  { id: 4, name: "Emma Davis", email: "emma@example.com", role: "Teacher", status: "Inactive", joinDate: "2024-01-05" },
  {
    id: 5,
    name: "James Wilson",
    email: "james@example.com",
    role: "Student",
    status: "Active",
    joinDate: "2024-04-12",
  },
  {
    id: 6,
    name: "Olivia Martinez",
    email: "olivia@example.com",
    role: "Admin",
    status: "Active",
    joinDate: "2024-02-28",
  },
  {
    id: 7,
    name: "William Taylor",
    email: "william@example.com",
    role: "Student",
    status: "Active",
    joinDate: "2024-03-15",
  },
  {
    id: 8,
    name: "Sophia Anderson",
    email: "sophia@example.com",
    role: "Teacher",
    status: "Active",
    joinDate: "2024-01-20",
  },
]

export function UsersTable() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-9" />
        </div>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "Admin" ? "default" : "secondary"}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.joinDate}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
