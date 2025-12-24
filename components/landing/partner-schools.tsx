"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"

import { schools } from "@/data/demodata"
import SchoolSearch from "../schoolSearch"
import { Button } from "../ui/button"


export default function PartnerSchools() {
  const [search, setSearch] = useState("")

  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(search.toLowerCase())
  )

  const visibleSchools = filteredSchools.slice(0, 5)

  return (
    <section id="schools" className="py-20 md:pb-25">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 md:mb-16">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold text-black">
              Partner <span className="text-orange-400">Schools</span></h2>
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
              <Button className="group text-sm bg-orange-400 hover:bg-orange-400/90 cursor-pointer rounded-none rounded-tr-3xl rounded-bl-3xl py-5 px-6 flex justify-center items-center gap-2 transition-transform duration-300 ease-out hover:scale-105">
                View all schools
                <ArrowRight size={16} className="transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
              </Button>

            </Link>
          </div>
        </div>

        {/* Schools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {visibleSchools.map((school) => (
            <Link
              key={school.id}
              href={`/schools/${school.id}`}
              className="block h-full"
            >
              <Card className="px-6 py-4 hover:shadow-lg flex flex-col gap-3 h-full rounded-none rounded-tr-3xl rounded-bl-3xl border-none transition-transform duration-300 hover:-translate-y-2">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={school.image || "/school.jpg"}
                    alt={school.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="font-bold text-sm text-black">
                  {school.name}
                </h3>

                <div className="flex items-center gap-1 text-gray-600 mt-auto">
                  <MapPin size={16} />
                  <span className="text-sm">{school.location}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>


        {/* Empty State */}
        {filteredSchools.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No schools found
          </p>
        )}
      </div>
    </section>
  )
}
