"use client"

import React, { useState } from "react"
import { ArrowLeft, MapPin, ChevronDown } from "lucide-react"
import { schools } from "@/data/demodata"
import Link from "next/link"
import { useRouter } from "next/navigation"

const languages = [
  { id: "english", name: "English" },
  { id: "hindi", name: "Hindi" },
]

interface ClassItem {
  id: number
  name: string
}

export default function SchoolClassesPage({ params }: { params: Promise<{ schoolId: number }> }) {
  const [expandedClassId, setExpandedClassId] = useState<number | null>(null)

  const { schoolId } = React.use(params)
  const router = useRouter()

  const numericId = Number(schoolId)
  const school = schools.find((s) => s.id === numericId)

  if (!school) {
    return <div className="p-10 text-red-600">School not found</div>
  }

  const classes: ClassItem[] = [
    { id: 1, name: "Nursery" },
    { id: 2, name: "LKG" },
    { id: 3, name: "UKG" },
    { id: 4, name: "Class 1" },
    { id: 5, name: "Class 2" },
    { id: 6, name: "Class 3" },
    { id: 7, name: "Class 4" },
    { id: 8, name: "Class 5" },
    { id: 9, name: "Class 6" },
    { id: 10, name: "Class 7" },
    { id: 11, name: "Class 8" },
    { id: 12, name: "Class 9" },
    { id: 13, name: "Class 10" },
  ]

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative">
      {expandedClassId && (
        <div
          onClick={() => setExpandedClassId(null)}
          className="fixed inset-0 z-20 bg-black/10 backdrop-blur-[1px] transition-all duration-300"
        />
      )}

      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 py-8 sm:py-10 lg:py-12 px-4 sm:px-6 relative z-50 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors duration-200 mb-6 sm:mb-8"
          >
            <ArrowLeft size={20} />
            <span className="text-sm sm:text-base font-medium">Back to Schools</span>
          </button>

          <div className="flex flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white/20 flex-shrink-0">
              <img src={school.image || "/school.jpg"} alt={school.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">{school.name}</h1>
              <p className="flex items-center gap-2 text-blue-100 mt-2 text-sm sm:text-base">
                <MapPin size={18} className="flex-shrink-0" />
                <span>{school.location}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 sm:py-10 lg:py-12 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-950 mb-2">Select Class</h2>
            <p className="text-sm sm:text-base text-gray-600">Choose a class to view available language options</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {classes.map((data) => {
              const isOpen = expandedClassId === data.id

              return (
                <div
                  key={data.id}
                  className={`relative self-start transition-all duration-300 
                                        ${isOpen ? "z-30" : "z-10"}
                                    `}
                >
                  <div
                    className={`
                                        border rounded-xl bg-white shadow-sm transition-all duration-300 overflow-hidden
                                        ${
                                          isOpen
                                            ? "ring-2 ring-blue-500 border-blue-500 shadow-xl scale-[1.02]"
                                            : "hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5"
                                        }
                                    `}
                  >
                    <button
                      onClick={() => setExpandedClassId(isOpen ? null : data.id)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between gap-2 group cursor-pointer"
                    >
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex-1 text-center">
                        {data.name}
                      </h3>
                      <ChevronDown
                        size={18}
                        className={`text-gray-400 group-hover:text-blue-600 transition-all duration-300 flex-shrink-0
                                                    ${isOpen ? "rotate-180" : ""}
                                                `}
                      />
                    </button>

                    <div
                      className={`transition-all duration-300 ease-in-out
                                                ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}
                                            `}
                    >
                      <div className="border-t border-gray-100 px-3 sm:px-4 py-3 bg-gradient-to-b from-gray-50 to-white">
                        <p className="text-xs font-medium text-gray-500 mb-2 text-center">Select Language</p>
                        <div className="flex flex-col gap-2">
                          {languages.map((lang) => (
                            <Link
                              key={lang.id}
                              href={`/schools/${schoolId}/${data.id}`}
                              className="border border-blue-200 rounded-lg py-2.5 px-3 text-sm font-medium text-blue-900 text-center 
                                                                bg-white hover:bg-blue-50 hover:border-blue-400 hover:shadow-sm
                                                                transition-all duration-200 active:scale-95"
                            >
                              {lang.name}
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
        </div>
      </div>
    </section>
  )
}
