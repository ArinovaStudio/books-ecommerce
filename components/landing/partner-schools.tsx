"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { MapPin, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

import SchoolSearch from "../schoolSearch"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

type School = {
  id: string
  name: string
  address: string
  image: string
  board?: string
  status: string
}

export default function PartnerSchools() {
  const [search, setSearch] = useState("")
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLogged, setIsLogged] = useState(false);
  const [popup, setPopUp] = useState(false);
  const router = useRouter()
  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/schools')
        const data = await response.json()

        if (data.success) {
          setSchools(data.schools.filter((school: School) => school.status === 'ACTIVE'))
        } else {
          setError('Failed to load schools')
        }
      } catch (error) {
        setError('Failed to load schools')
        console.error('Error fetching schools:', error)
      } finally {
        setLoading(false)
      }
    }
    const me = async () => {
      const req = await fetch("/api/auth/check")
      if (req.status === 200) {
        const data = await req.json()
        // console.log(data);
        setIsLogged(data.authenticated)
      } 
    }
    fetchSchools()
    me()
  }, [])

  const handleClick = (id: string) => {
    if (isLogged) {
      router.push(`/schools/${id}`)
    }
    else {
      setPopUp(true)
    }
  }

  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(search.toLowerCase()) ||
    school.address.toLowerCase().includes(search.toLowerCase()) ||
    (school.board && school.board.toLowerCase().includes(search.toLowerCase()))
  )

  const visibleSchools = filteredSchools.slice(0, 5)

  return (
    <section id="schools" className="py-20 md:pb-25">
      {
        popup && (
          <div className="w-screen h-screen fixed inset-0 bg-black/40 z-9999 flex justify-center items-center">
            <div className="w-1/3 h-auto bg-white rounded-2xl p-8 px-8 pb-6">
              <h1 className="text-xl">Please <b>Login</b> First to access</h1>
              <p className="text-sm text-gray-600 mt-2">You must be logged in to access the school portal. Please sign in with your registered credentials to continue.</p>

              <div className="w-full flex justify-end items-center gap-4 mt-6">
                <button className="text-base px-4 py-2 border border-red-400 rounded-lg cursor-pointer text-red-400" onClick={() => setPopUp(false)}>Cancel</button>
                <button className="text-base px-4 py-2 bg-yellow-500 rounded-lg cursor-pointer text-white" onClick={() => router.push("/signin")}>Login</button>
              </div>
            </div>
          </div>
        )
      }
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 md:mb-16">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold text-black">
              Partner <span className="text-[#4169B4]">Schools</span></h2>
            <p className="text-md md:text-md text-gray-600 max-w-2xl">
              We work with top schools across India to bring you the exact books
              and supplies your child needs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 md:gap-10 w-full">
            {/* Search */}
            <SchoolSearch
              value={search}
              onChange={setSearch}
              results={filteredSchools}
              placeholder="Search Schools..."
              className="w-[60%]"
            />

            {/* View all */}
            <Link
              href="/schools"
            >
              <Button className="group text-sm bg-[#4169B4] hover:bg-[#466B4] cursor-pointer rounded-none rounded-tr-3xl rounded-bl-3xl py-5 px-6 flex justify-center items-center gap-2 transition-transform duration-300 ease-out hover:scale-105">
                View all schools
                <ArrowRight size={16} className="transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
              </Button>

            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#46B4]/90" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="cursor-pointer"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Schools Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {visibleSchools.map((school) => (
              <div
                key={school.id}
                onClick={() => handleClick(school.id)}
                className="block h-full"
              >
                <Card className="px-6 py-4 hover:shadow-lg flex flex-col gap-3 h-full rounded-none rounded-tr-3xl rounded-bl-3xl border-none transition-transform duration-300 hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
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

                  <h3 className="font-bold text-sm text-black">
                    {school.name}
                  </h3>

                  {school.board && (
                    <p className="text-xs text-orange-400 font-medium">
                      {school.board}
                    </p>
                  )}

                  <div className="flex items-center gap-1 text-gray-600 mt-auto">
                    <MapPin size={16} />
                    <span className="text-sm truncate">{school.address}</span>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}


        {/* Empty State */}
        {!loading && !error && filteredSchools.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-2">
              {search ? 'No schools found matching your search' : 'No schools available'}
            </p>
            {search && (
              <Button
                onClick={() => setSearch('')}
                variant="outline"
                className="cursor-pointer"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
