"use client"

import Header from "@/components/header";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react"

export default function SchoolsPage() {
    const schools = [
        { id: "delhi-public-school-new-delhi", name: "Delhi Public School", location: "New Delhi", icon: "🏫" },
        { id: "st-marys-convent-school-mumbai", name: "St. Mary's Convent School", location: "Mumbai", icon: "🏫" },
        { id: "the-heritage-school-bangalore", name: "The Heritage School", location: "Bangalore", icon: "🏫" },
        { id: "ryan-international-school-gurugram", name: "Ryan International School", location: "Gurugram", icon: "🏫" },
        { id: "kendriya-vidyalaya-chennai", name: "Kendriya Vidyalaya", location: "Chennai", icon: "🏫" },
        { id: "la-martiniere-college-lucknow", name: "La Martiniere College", location: "Lucknow", icon: "🏫" },
        { id: "modern-high-school-kolkata", name: "Modern High School", location: "Kolkata", icon: "🏫" },
        { id: "national-public-school-bangalore", name: "National Public School", location: "Bangalore", icon: "🏫" },
        { id: "city-montessori-school-lucknow", name: "City Montessori School", location: "Lucknow", icon: "🏫" },
        { id: "dav-public-school-patna", name: "DAV Public School", location: "Patna", icon: "🏫" },
        { id: "springdale-school-amritsar", name: "Springdale School", location: "Amritsar", icon: "🏫" },
        { id: "bishop-cotton-school-shimla", name: "Bishop Cotton School", location: "Shimla", icon: "🏫" },
        { id: "st-xaviers-high-school-ranchi", name: "St. Xavier’s High School", location: "Ranchi", icon: "🏫" },
        { id: "don-bosco-school-guwahati", name: "Don Bosco School", location: "Guwahati", icon: "🏫" },
        { id: "mount-carmel-school-new-delhi", name: "Mount Carmel School", location: "New Delhi", icon: "🏫" },
        { id: "army-public-school-pune", name: "Army Public School", location: "Pune", icon: "🏫" },
        { id: "hansraj-public-school-panchkula", name: "Hansraj Public School", location: "Panchkula", icon: "🏫" },
        { id: "sardar-patel-vidyalaya-new-delhi", name: "Sardar Patel Vidyalaya", location: "New Delhi", icon: "🏫" },
        { id: "sacred-heart-school-jalandhar", name: "Sacred Heart School", location: "Jalandhar", icon: "🏫" },
        { id: "the-doon-school-dehradun", name: "The Doon School", location: "Dehradun", icon: "🏫" },
    ];

    const [query, setQuery] = useState("")

    return (
        <section className="py-5">
            <Header classname="shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] pb-2" />
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Page Heading */}
                <h1 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
                    All Partner Schools
                </h1>
                <p className="text-gray-600 text-lg mb-10 max-w-2xl">
                    Browse through our list of verified partner schools across India.
                </p>

                {/* School Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {schools.map((school, index) => (
                        <Link key={school.id} href={`/schools/${school.id}`}>
                            <Card
                                key={index}
                                className="p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md  hover:-translate-y-1 transition-all      cursor-pointer flex flex-col gap-4 h-56 w-full"
                            >
                                {/* Icon */}
                                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center shadow-inner">
                                    <span className="text-3xl">{school.icon}</span>
                                </div>

                                {/* Name */}
                                <h3 className="font-semibold text-base text-blue-950 leading-tight">
                                    {school.name}
                                </h3>

                                {/* Divider */}
                                <div className="w-full h-px bg-gray-200 my-4"></div>

                                {/* Location */}
                                <div className="flex items-center gap-1 text-gray-600 mt-auto">
                                    <MapPin size={15} className="opacity-70" />
                                    <span className="text-sm">{school.location}</span>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}
