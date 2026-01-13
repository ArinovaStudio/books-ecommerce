"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SchoolClasses } from "@/components/admin/school-classes"
import { SchoolClassUsers } from "@/components/admin/school-users"
import { useAdmin } from "@/app/context/admin"
import SchoolSection from "@/components/admin/school-section"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type Section = {
  id: string
  name: string
}

export default function SubAdminUsersPage() {
  const { user, schoolId } = useAdmin()
  const [selectedClass, setSelectedClass] = useState<any | null>(null)
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)

  return (
    <>
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Users</BreadcrumbPage>
            </BreadcrumbItem>

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
                    {selectedSection?.name || 'Section'}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card>
        <CardContent>
          {!selectedClass && (
            <SchoolClasses
              schoolId={schoolId}
              onSelectClass={setSelectedClass}
            />
          )}

          {selectedClass && !selectedSection && (
            <SchoolSection
              schoolId={schoolId}
              school={schoolId}
              classes={selectedClass}
              onSelectSection={setSelectedSection}
              onBack={() => setSelectedClass(null)}
            />
          )}

          {selectedClass && selectedSection && (
            <SchoolClassUsers
              activeTab="users"
              schoolId={schoolId}
              classItem={selectedClass}
              sectionId={selectedSection.id}
              onBack={() => setSelectedSection(null)}
            />
          )}
        </CardContent>
      </Card>
    </>
  )
}