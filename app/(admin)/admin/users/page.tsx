"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SchoolCards } from "@/components/admin/school-cards"
import { SchoolClasses } from "@/components/admin/school-classes"
import { SchoolClassUsers } from "@/components/admin/school-users"
import SchoolSection from "@/components/admin/school-section"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type School = {
  id: string
  name: string
}

type Class = {
  id: string
  name: string
}

export default function UsersPage() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  return (
    <>
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Users</BreadcrumbPage>
            </BreadcrumbItem>

            {selectedSchool && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => {
                      setSelectedSchool(null)
                      setSelectedClass(null)
                      setSelectedSection(null)
                    }}
                    className="cursor-pointer"
                  >
                    {selectedSchool?.name || 'School'}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}

            {selectedClass && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => {
                      setSelectedClass(null)
                      setSelectedSection(null)
                    }}
                    className="cursor-pointer"
                  >
                    {selectedClass?.name || 'Class'}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}

            {selectedSection && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {selectedSection || 'Section'}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
          </div>
        </CardHeader>
        <CardContent>
          {!selectedSchool && !selectedClass && (
            <SchoolCards onSelectSchool={setSelectedSchool} activeTab="users" />
          )}

          {selectedSchool && !selectedClass && (
            <SchoolClasses
              schoolId={selectedSchool.id}
              onBack={() => setSelectedSchool(null)}
              onSelectClass={setSelectedClass}
            />
          )}

          {selectedSchool && selectedClass && !selectedSection && (
            <SchoolSection
              school={selectedSchool.name}
              classes={selectedClass}
              onSelectSection={setSelectedSection}
              onBack={() => setSelectedClass(null)}
            />
          )}

          {selectedSchool && selectedClass && selectedSection && (
            <SchoolClassUsers
              activeTab="users"
              schoolId={selectedSchool.id}
              classItem={selectedClass}
              sectionId={selectedSection}
              onBack={() => setSelectedSection(null)}
            />
          )}
        </CardContent>
      </Card>
    </>
  )
}