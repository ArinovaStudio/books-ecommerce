"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SchoolClasses } from "@/components/admin/school-classes"
import { SchoolClassUsers } from "@/components/admin/school-users"
import { AdminHeader } from "@/components/admin/header"
import { useAdmin } from "@/app/context/admin"
import LanguageSelector from "@/components/languageSelector"
import { AddSchoolModal } from "@/components/addSchoolModal"
import { Bundels } from "@/components/Bundels"
import { OrdersTable } from "@/components/admin/user-table"
import SchoolSection from "@/components/admin/school-section"
import ProductTables from "@/components/product-tables"

export default function AdminDashboard() {
    const { activeTab, user, schoolId } = useAdmin()
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedClass, setSelectedClass] = useState<any | null>(null)
    const [selectedSection, setSelectedSection] = useState<string | null>(null)
    const [selectedLang, setSelectedLang] = useState<string | null>(null)

    useEffect(() => {
        setSelectedClass(null)
        setSelectedLang(null)
    }, [activeTab])

    return (
        <>
            <AdminHeader />

            <main className="flex-1 overflow-y-auto p-4 lg:p-8">

                {/* Users Tab */}
                {activeTab === "users" && (
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
                                    school={schoolId}
                                    classes={selectedClass}
                                    onSelectSection={setSelectedSection}
                                    onBack={() => setSelectedClass(null)}
                                />
                            )}

                            {selectedClass && selectedSection && (
                                <SchoolClassUsers
                                    activeTab={activeTab}
                                    schoolId={user.schoolId}
                                    // classId={selectedClass}
                                    classItem={selectedClass}
                                    sectionId={selectedSection}
                                    onBack={() => setSelectedSection(null)}
                                />
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Order Tabs */}
                {activeTab === "orders" && (
                    <Card>
                        <CardContent>
                            <OrdersTable role={user.role} subAdminSchoolId={schoolId} />
                        </CardContent>
                    </Card>
                )}
            </main>
        </>
    )
}
