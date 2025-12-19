"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalyticsCharts } from "@/components/admin/analytics-chart"
import { SchoolCards } from "@/components/admin/school-cards"
import { SchoolClasses } from "@/components/admin/school-classes"
import { SchoolClassUsers } from "@/components/admin/school-users"
import { AdminHeader } from "@/components/admin/header"
import { useAdmin } from "@/app/context/admin"
import LanguageSelector from "@/components/languageSelector"
import { AddSchoolModal } from "@/components/addSchoolModal"
import { BundleCard } from "@/components/BundleCard"

export default function AdminDashboard() {
  const { activeTab } = useAdmin()

  const [selectedSchool, setSelectedSchool] = useState<{ id: number; name: string } | null>(null)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [selectedLang, setSelectedLang] = useState<string | null>(null)

  // Reset selections when switching tabs
  useEffect(() => {
    setSelectedSchool(null)
    setSelectedClass(null)
    setSelectedLang(null)
  }, [activeTab])

  return (
    <>
      <AdminHeader />

      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        {/* Analytics Tab */}
        {activeTab === "analytics" && <AnalyticsCharts />}

        {/* Users Tab */}
        {activeTab === "users" && (
          <Card>
            <CardHeader>
              <CardTitle>Registered Users</CardTitle>
              <CardDescription>View and manage all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedSchool && !selectedClass && (
                <SchoolCards onSelectSchool={setSelectedSchool} />
              )}

              {selectedSchool && !selectedClass && (
                <SchoolClasses
                  school={selectedSchool}
                  onBack={() => setSelectedSchool(null)}
                  onSelectClass={setSelectedClass}
                />
              )}

              {selectedSchool && selectedClass && (
                <SchoolClassUsers
                  className={selectedClass}
                  onBack={() => setSelectedClass(null)}
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
                <div className="flex flex-col gap-2">
                  <CardTitle>Schools</CardTitle>
                  <CardDescription>View and manage all schools</CardDescription>
                </div>
                <AddSchoolModal />
              </div>
            </CardHeader>
            <CardContent>
              {!selectedSchool && <SchoolCards onSelectSchool={setSelectedSchool} />}
              {selectedSchool && !selectedClass && (
                <SchoolClasses
                  school={selectedSchool}
                  onBack={() => setSelectedSchool(null)}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Bundles Tab */}
        {activeTab === "bundels" && (
          <Card>
            <CardHeader>
              <CardTitle>Bundles</CardTitle>
              <CardDescription>View and manage all Bundles</CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedSchool && <SchoolCards onSelectSchool={setSelectedSchool} />}
              {selectedSchool && !selectedClass && (
                <SchoolClasses
                  school={selectedSchool}
                  onBack={() => setSelectedSchool(null)}
                  onSelectClass={setSelectedClass}
                />
              )}
              {selectedSchool && selectedClass && !selectedLang && (
                <LanguageSelector
                  onSelectingLang={setSelectedLang}
                  onBack={() => setSelectedClass(null)}
                />
              )}
              {selectedSchool && selectedClass && selectedLang && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  <BundleCard title="Basic" price={999} />
                  <BundleCard title="Standard" price={1999} />
                  <BundleCard title="Premium" price={2999} />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </>
  )
}
