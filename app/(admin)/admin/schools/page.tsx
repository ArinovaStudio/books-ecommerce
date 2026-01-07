"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SchoolCards } from "@/components/admin/school-cards"
import { SchoolClasses } from "@/components/admin/school-classes"
import FilteredProductTable from "@/components/admin/filtered-products-tables"
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

export default function SchoolsPage() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)

  return (
    <>
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Schools</BreadcrumbPage>
            </BreadcrumbItem>

            {selectedSchool && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => {
                      setSelectedSchool(null)
                      setSelectedClass(null)
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
                  <BreadcrumbPage>
                    {selectedClass?.name || 'Class'}
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
          {!selectedSchool && <SchoolCards onSelectSchool={setSelectedSchool} activeTab="schools" />}
          {selectedSchool && !selectedClass && (
            <SchoolClasses
              schoolId={selectedSchool.id}
              onSelectClass={setSelectedClass}
              onBack={() => setSelectedSchool(null)}
            />
          )}
          {
            selectedSchool && selectedClass && (
              <FilteredProductTable setSelectedClass={setSelectedClass} selectedSchool={selectedSchool.id} selectedClass={selectedClass.id} />
            )
          }
        </CardContent>
      </Card>
    </>
  )
}