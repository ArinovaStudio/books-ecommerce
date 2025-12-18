"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Search } from "lucide-react"

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
  {
    id: 4,
    name: "Summit Charter School",
    location: "Houston, TX",
    students: 720,
    teachers: 48,
    status: "Pending",
    established: "2018",
  },
  {
    id: 5,
    name: "Greenfield Middle School",
    location: "Phoenix, AZ",
    students: 980,
    teachers: 55,
    status: "Active",
    established: "2001",
  },
  {
    id: 6,
    name: "Westside Preparatory",
    location: "Philadelphia, PA",
    students: 650,
    teachers: 42,
    status: "Active",
    established: "2012",
  },
  {
    id: 7,
    name: "Mountain View High",
    location: "San Antonio, TX",
    students: 1100,
    teachers: 72,
    status: "Active",
    established: "1995",
  },
]

export function SchoolsTable() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search schools..." className="pl-9" />
        </div>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>School Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Teachers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Established</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.map((school) => (
              <TableRow key={school.id}>
                <TableCell className="font-medium">{school.name}</TableCell>
                <TableCell className="text-muted-foreground">{school.location}</TableCell>
                <TableCell>{school.students.toLocaleString()}</TableCell>
                <TableCell>{school.teachers}</TableCell>
                <TableCell>
                  <Badge variant={school.status === "Active" ? "default" : "secondary"}>{school.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{school.established}</TableCell>
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
