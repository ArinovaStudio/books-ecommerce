"use client"

import { useState, useEffect } from "react"

type School = {
  id: string
  name: string
  image: string
  status: string
}

export default function Companies() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/schools')
        const data = await response.json()

        if (data.success) {
          // console.log("Schools count: ", data.schools.length)
          setSchools(data.schools.filter((school: School) => school.status === 'ACTIVE'))
        }
      } catch (error) {
        console.error('Error fetching schools:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSchools()
  }, [])

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 border-t border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">
              Trusted Schools All Over the World
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 border-t border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">
            Trusted Schools
          </p>
        </div>

        <div className="relative">
          <div className="flex animate-marquee space-x-8 sm:space-x-12">
            {schools.concat(schools).map((school, index) => (
              <div key={`${school.id}-${index}`} className="flex items-center space-x-4 flex-shrink-0">
                <img
                  src={school.image || "/school.jpg"}
                  alt={school.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/school.jpg"
                  }}
                />
                <span className="text-lg sm:text-xl font-semibold text-muted-foreground whitespace-nowrap">
                  {school.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </section>
  )
}
