"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalyticsCharts } from "@/components/admin/analytics-chart"
import { SchoolCards } from "@/components/admin/school-cards"
import { SchoolClasses } from "@/components/admin/school-classes"
import { SchoolClassUsers } from "@/components/admin/school-users"
import { AdminHeader } from "@/components/admin/header"
import { useAdmin } from "@/app/context/admin"
// import LanguageSelector from "@/components/languageSelector"
import { AddSchoolModal } from "@/components/addSchoolModal"
// import { Bundels } from "@/components/Bundels"

export default function AdminDashboard() {
  const { activeTab } = useAdmin()
  const [selectedSchool, setSelectedSchool] = useState<{
    id: number
    name: string
  } | null>(null)

  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [selectedLang, setSelectedLang] = useState<string | null>(null)

  return (
    <>
      <AdminHeader />

      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        {activeTab === "analytics" && <AnalyticsCharts />}

        {activeTab === "users" && (
          <Card>
            <CardHeader>
              <CardTitle>Registered Users</CardTitle>
              <CardDescription>
                View and manage all registered users
              </CardDescription>
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

        {activeTab === "schools" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <CardTitle>Schools</CardTitle>
                  <CardDescription>
                    View and manage all schools
                  </CardDescription>
                </div>
                <AddSchoolModal />
              </div>
            </CardHeader>

            <CardContent>
              {/* STEP 1: Select School */}
              {!selectedSchool && (
                <SchoolCards onSelectSchool={setSelectedSchool} />
              )}

              {/* STEP 2: Select Class */}
              {selectedSchool && !selectedClass && (
                <SchoolClasses
                  school={selectedSchool}
                  onBack={() => setSelectedSchool(null)}
                  onSelectClass={setSelectedClass}
                />
              )}

              {/* STEP 3: Select Language
              {selectedSchool && selectedClass && !selectedLang && (
                <LanguageSelector
                  onSelectingLang={setSelectedLang}
                  onBack={() => setSelectedClass(null)}
                />
              )} */}

              {/* STEP 4: select Bundels */}
              {selectedSchool && selectedClass && selectedLang && (
                <div className="text-lg font-semibold">
                  Selected:
                  <br />
                  School: {selectedSchool.name}
                  <br />
                  Class: {selectedClass}
                  <br />
                  Language: {selectedLang}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "bundels" && (
          <Card>
            <CardHeader>
              <CardTitle>Bundels</CardTitle>
              <CardDescription>
                View and manage all Bundels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* STEP 1: Select School */}
              {!selectedSchool && (
                <SchoolCards onSelectSchool={setSelectedSchool} />
              )}

              {/* STEP 2: Select Class */}
              {selectedSchool && !selectedClass && (
                <SchoolClasses
                  school={selectedSchool}
                  onBack={() => setSelectedSchool(null)}
                  onSelectClass={setSelectedClass}
                />
              )}

              {/* STEP 3: Select Language
              {selectedSchool && selectedClass && !selectedLang && (
                <LanguageSelector
                  onSelectingLang={setSelectedLang}
                  onBack={() => setSelectedClass(null)}
                />
              )} */}

              {/* STEP 4: select Bundels */}
              {/* {selectedSchool && selectedClass && selectedLang && (
                <Bundels />
              )} */}
            </CardContent>
          </Card>
        )}
      </main>
    </>
  )
}
