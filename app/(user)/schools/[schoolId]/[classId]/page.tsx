"use client"

import React, { useState, useEffect } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import ProductTables from "@/components/product-tables"

type Section = {
  id: string
  name: string
  language: string
}

type School = {
  id: string
  name: string
  address: string
  image: string
}

type Class = {
  id: string
  name: string
  academicYear: string
}

export default function ClassSectionsPage({ params }: { params: Promise<{ schoolId: string, classId: string }> }) {
  const [sections, setSections] = useState<Section[]>([])
  const [school, setSchool] = useState<School | null>(null)
  const [classData, setClassData] = useState<Class | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { schoolId, classId } = React.use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const section = searchParams.get('section')
  const language = searchParams.get('language')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch school details
        const schoolResponse = await fetch(`/api/schools/${schoolId}`)
        const schoolData = await schoolResponse.json()
        if (schoolData.success) {
          setSchool(schoolData.school)
        }

        // Fetch classes to get the specific class data
        const classesResponse = await fetch(`/api/admin/schools/${schoolId}/classes`)
        const classesData = await classesResponse.json()
        if (classesData.success) {
          const targetClass = classesData.classes.find((c: any) => c.id === classId)
          if (targetClass) {
            setClassData({
              id: targetClass.id,
              name: targetClass.name,
              academicYear: new Date().getFullYear().toString()
            })
            setSections(targetClass.sectionDetails || [])
          }
        }
      } catch (error) {
        setError('Failed to load data')
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [schoolId, classId])

  // If section parameter is present, show products
  if (section) {
    return (
      <div className="min-h-screen p-8">
        <ProductTables 
          role="USER" 
          params={{ 
            schoolId: schoolId as string, 
            classId: classId as string,
            section: section as string
          }} 
          searchParams={{ language: language as string }} 
        />
      </div>
    )
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading sections...</p>
        </div>
      </section>
    )
  }

  if (error || !school || !classData) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Data not found'}</p>
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
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="relative py-8 sm:py-10 lg:py-12 px-4 sm:px-6 bg-center bg-cover shadow-lg" style={{ backgroundImage: `url(${school.image || "/school.jpg"})` }}>
        <div className="absolute bg-black/50 w-full h-full top-0 left-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors duration-200 mb-6 sm:mb-8"
          >
            <ArrowLeft size={20} />
            <span className="text-sm sm:text-base font-medium">Back to Classes</span>
          </button>

          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{school.name}</h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-100">{classData.name}</h2>
            <p className="text-blue-200 mt-2">{classData.academicYear}</p>
          </div>
        </div>
      </div>

      <div className="py-8 sm:py-10 lg:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-blue-950 mb-2">Select Section</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Choose a section to view available books and materials
            </p>
          </div>

          {sections.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-2">No sections available for this class</p>
              <p className="text-gray-400 text-sm">Sections will be added soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {sections.map((section) => (
                <Link
                  key={section.id}
                  href={`/schools/${schoolId}/${classId}?section=${section.name}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-200 group-active:scale-95">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                      <span className="text-xl font-bold text-blue-600">{section.name}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Section {section.name}</h4>
                    <p className="text-sm text-gray-500">{section.language}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
