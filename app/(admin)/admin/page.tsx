"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalyticsCharts } from "@/components/admin/analytics-chart"
import { SchoolCards } from "@/components/admin/school-cards"
import { SchoolClasses } from "@/components/admin/school-classes"
import { SchoolClassUsers } from "@/components/admin/school-users"
import { AdminHeader } from "@/components/admin/header"
import { useAdmin } from "@/app/context/admin"
import { OrdersTable } from "@/components/admin/user-table"
import SchoolSection from "@/components/admin/school-section"
import ProductTables from "@/components/product-tables"
import FilteredProductTable from "@/components/admin/filtered-products-tables"
import { PromoteUserDialog } from "@/components/PromoteUser"
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

type Section = {
  id: string
  name: string
}

export default function AdminDashboard() {
  const { activeTab, role } = useAdmin()
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  // const [selectedSection, setSelectedSection] = useState<Section | null>(null)

  /*const [selectedSchool, setSelectedSchool] = useState<string | null>(null)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)*/
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [selectedLang, setSelectedLang] = useState<string | null>(null)

  // Reset selections when switching tabs
  useEffect(() => {
    setSelectedSchool(null)
    setSelectedClass(null)
    setSelectedSection(null)
    setSelectedLang(null)
  }, [activeTab])

  useEffect(() => {
    console.log("selected school = ", selectedSchool, "\nselected class =", selectedClass, "\nselected section = ", selectedSection)
  }, [selectedClass, selectedSchool, selectedSection])

  return (
    <>
      <AdminHeader />

      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>

              {/* Active Tab */}
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">
                  {activeTab}
                </BreadcrumbPage>
              </BreadcrumbItem>

              {/* School */}
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

              {/* Class */}
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

              {/* Section (current page) */}
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

        {/* Analytics Tab */}
        {activeTab === "analytics" && <AnalyticsCharts />}

        {/* Users Tab */}
        {activeTab === "users" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                {/* <div>
                  <CardTitle>Registered Users</CardTitle>
                  <CardDescription>View and manage all registered users</CardDescription>
                </div> */}
                {/* {role === "ADMIN" && !selectedSchool && !selectedClass && !selectedSection && <PromoteUserDialog />} */}
              </div>
            </CardHeader>
            <CardContent>
              {!selectedSchool && !selectedClass && (
                <SchoolCards onSelectSchool={setSelectedSchool} activeTab={activeTab} />
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
                  classes={selectedClass.id}
                  onSelectSection={setSelectedSection}
                  onBack={() => setSelectedClass(null)}
                />
              )}

              {selectedSchool && selectedClass && selectedSection && (
                <SchoolClassUsers
                  activeTab={activeTab}
                  schoolId={selectedSchool.id}
                  classItem={selectedClass}
                  sectionId={selectedSection}
                  // className={selectedClass.name}
                  onBack={() => setSelectedSection(null)}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Schools Tab */}
        {activeTab === "schools" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                {/* <div className="flex flex-col gap-2">
                  <CardTitle>Schools</CardTitle>
                  <CardDescription>View and manage all schools</CardDescription>
                </div> */}
              </div>
            </CardHeader>
            <CardContent>
              {!selectedSchool && <SchoolCards onSelectSchool={setSelectedSchool} activeTab={activeTab} />}
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
        )}

        {/* Bundles Tab
        {activeTab === "bundels" && (
          <Card>
            <CardHeader>
              <CardTitle>Bundles</CardTitle>
              <CardDescription>View and manage all Bundles</CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedSchool && <SchoolCards onSelectSchool={setSelectedSchool} activeTab={activeTab} />}
              {selectedSchool && !selectedClass && (
                <SchoolClasses
                  school={selectedSchool}
                  onBack={() => setSelectedSchool(null)}
                  onSelectClass={setSelectedClass}
                />
              )}
              {selectedSchool && selectedClass && !selectedLang && (
                <LanguageSelector
                  schoolId={selectedSchool.id}
                  classId={selectedClass.id}
                  onSelectingLang={setSelectedLang}
                  onBack={() => setSelectedClass(null)}
                />
              )}

              {selectedSchool && selectedClass && selectedLang && (
                <Bundels
                  onBack={() => setSelectedLang(null)}
                  classId={selectedClass.id}
                  language={selectedLang} />
              )}
            </CardContent>
          </Card>
        )} */}

        {/* Order Tabs */}
        {activeTab === "orders" && (
          <Card>
            <CardHeader>
            </CardHeader>
            <CardContent>
              <OrdersTable role="ADMIN" />
            </CardContent>
          </Card>
        )}

        {/* Product Tab */}
        {/* {activeTab === "products" && (
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>View and manage all Products</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductTables />
            </CardContent>
          </Card>
        )} */}
      </main>
    </>
  )
}
