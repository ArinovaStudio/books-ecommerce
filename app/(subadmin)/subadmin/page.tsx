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
    const { activeTab, user } = useAdmin()
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [selectedClass, setSelectedClass] = useState<{ id: string; name: string } | null>(null)
    const [selectedSection, setSelectedSection] = useState<{ id: string; name: string } | null>(null)
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
                        <CardHeader>
                            <CardTitle>Registered Users</CardTitle>
                            <CardDescription>View and manage all registered users</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!selectedClass && (
                                <SchoolClasses
                                    schoolId={user.schoolId}
                                    onSelectClass={setSelectedClass}
                                />
                            )}

                            {selectedClass && !selectedSection && (
                                <SchoolSection
                                    school={user.schoolId}
                                    classes={selectedClass.id}
                                    onSelectSection={setSelectedSection}
                                    onBack={() => setSelectedClass(null)}
                                />
                            )}

                            {selectedClass && selectedSection && (
                                <SchoolClassUsers
                                    activeTab={activeTab}
                                    schoolId={user.schoolId}
                                    classId={selectedClass.id}
                                    sectionId={selectedSection.id}
                                    onBack={() => setSelectedSection(null)}
                                />
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Schools Tab */}
                {/* {activeTab === "schools" && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-2">
                                    <CardTitle>Schools</CardTitle>
                                    <CardDescription>View and manage all schools</CardDescription>
                                </div>
                                <AddSchoolModal onSchoolAdded={() => setRefreshTrigger(prev => prev + 1)} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {!selectedSchool && <SchoolCards onSelectSchool={setSelectedSchool} activeTab={activeTab} refreshTrigger={refreshTrigger} />}
                            {selectedSchool && !selectedClass && (
                                <SchoolClasses
                                    school={selectedSchool}
                                    onBack={() => setSelectedSchool(null)}
                                />
                            )}
                        </CardContent>
                    </Card>
                )} */}

                {/* Bundles Tab */}
                {/* {activeTab === "bundels" && (
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
                            <CardTitle>Orders</CardTitle>
                            <CardDescription>View and manage all Orders</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrdersTable role={user.role} subAdminSchoolId={user.schoolId} />
                        </CardContent>
                    </Card>
                )}

                {/* Product Tab */}
                {activeTab === "products" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Products</CardTitle>
                            <CardDescription>View and manage all Products</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProductTables />
                        </CardContent>
                    </Card>
                )}
            </main>
        </>
    )
}
