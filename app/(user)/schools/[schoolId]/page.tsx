"use client"

import React, { useState, useEffect } from "react"
import { ArrowLeft, MapPin, ChevronDown, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type School = {
  id: string
  name: string
  address: string
  image: string
  board?: string
  languages: string[]
  classRange: string
}

type Class = {
  id: string
  name: string
  sections: string[]
  academicYear: string
}

type ClassItem = { name: string }

const CLASS_ORDER = [
  "Nursery", "PP I", "PP II",
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "Class 11", "Class 12"
]

const normalize = (name: string) =>
  name
    .replace(/\s+/g, " ")
    .trim()

const sortClasses = (a: ClassItem, b: ClassItem): number => {
  const indexA = CLASS_ORDER.indexOf(normalize(a.name))
  const indexB = CLASS_ORDER.indexOf(normalize(b.name))

  return (indexA === -1 ? Infinity : indexA) -
         (indexB === -1 ? Infinity : indexB)
}



export default function SchoolClassesPage({ params }: { params: Promise<{ schoolId: string }> }) {
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null)
  const [school, setSchool] = useState<School | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { schoolId } = React.use(params)
  const router = useRouter()

  useEffect(() => {
    const fetchSchoolData = async () => {
      setLoading(true)
      try {
        // Fetch school details
        const schoolResponse = await fetch(`/api/schools/${schoolId}`)
        const schoolData = await schoolResponse.json()

        if (!schoolData.success) {
          setError('School not found')
          return
        }

        setSchool(schoolData.school)

        // Fetch school classes
        const classesResponse = await fetch(`/api/admin/schools/${schoolId}/classes`)
        const classesData = await classesResponse.json()

        if (classesData.success) {
          setClasses(classesData.classes.sort(sortClasses))
        }
      } catch (error) {
        setError('Failed to load school data')
        console.error('Error fetching school data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (schoolId) {
      fetchSchoolData()
    }
  }, [schoolId])

  // Loading state
  if (loading) {
    return (
      <section className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading school details...</p>
        </div>
      </section>
    )
  }

  // Error state
  if (error || !school) {
    return (
      <section className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'School not found'}</p>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Go Back
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 relative">
      {expandedClassId && (
        <div
          onClick={() => setExpandedClassId(null)}
          className="fixed inset-0 z-20 bg-black/10 backdrop-blur-[1px] transition-all duration-300"
        />
      )}

      <div className="relative py-8 sm:py-10 lg:py-12 px-4 sm:px-6 relative z-50 shadow-lg bg-center bg-contain bg-size-[100%_auto]" style={{ backgroundImage: `url(${school.image || "/school.jpg"})` }}>
        <div className="absolute bg-black/50 w-full h-full top-0 left-0 -z-1"></div>
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors duration-200 mb-6 sm:mb-8"
          >
            <ArrowLeft size={20} />
            <span className="text-sm sm:text-base font-medium">Back to Schools</span>
          </button>

          <div className="flex flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white/20 shrink-0">
              <img
                src={school.image || "/school.jpg"}
                alt={school.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/school.jpg"
                }}
              />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">{school.name}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                <p className="flex items-center gap-2 text-blue-100 text-sm sm:text-base">
                  <MapPin size={18} className="shrink-0" />
                  <span>{school.address}</span>
                </p>
                {school.board && (
                  <span className="text-xs sm:text-sm bg-blue-100/20 text-blue-100 px-2 py-1 rounded-full">
                    {school.board}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 sm:py-10 lg:py-12 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-950 mb-2">Select Class</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Choose a class to view available language options
              {school.classRange && (
                <span className="ml-2 text-blue-600 font-medium">({school.classRange})</span>
              )}
            </p>
          </div>

          {classes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-2">No classes available for this school</p>
              <p className="text-gray-400 text-sm">Classes will be added soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {classes.map((classData) => {
                const isOpen = expandedClassId === classData.id
                const availableLanguages = school.languages || ['English']

                return (
                  <div
                    key={classData.id}
                    className={`relative self-start transition-all duration-300 
                      ${isOpen ? "z-30" : "z-10"}
                    `}
                  >
                    <div
                      className={`
                        border rounded-xl bg-white shadow-sm transition-all duration-300 overflow-hidden
                        ${isOpen
                          ? "ring-2 ring-blue-500 border-blue-500 shadow-xl scale-[1.02]"
                          : "hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5"
                        }
                      `}
                    >
                      <button
                        onClick={() => setExpandedClassId(isOpen ? null : classData.id)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between gap-2 group cursor-pointer"
                      >
                        <div className="flex-1 text-center">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                            {classData.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {classData.academicYear}
                          </p>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`text-gray-400 group-hover:text-blue-600 transition-all duration-300 shrink-0
                            ${isOpen ? "rotate-180" : ""}
                          `}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out
                          ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}
                        `}
                      >
                        <div className="border-t border-gray-100 px-3 sm:px-4 py-3 bg-linear-to-b from-gray-50 to-white">
                          <p className="text-xs font-medium text-gray-500 mb-2 text-center">
                            Select Language
                          </p>

                          {/* Scrollable container */}
                          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pb-3 no-scrollbar">
                            {availableLanguages.map((lang) => (
                              <Link
                                key={lang}
                                href={`/schools/${schoolId}/${classData.id}?language=${lang.toLowerCase()}`}
                                className="border border-blue-200 rounded-lg py-2.5 px-3 text-sm font-medium 
          text-blue-900 text-center bg-white
          hover:bg-blue-50 hover:border-blue-400 hover:shadow-sm
          transition-all duration-200 active:scale-95"
                              >
                                {lang}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}