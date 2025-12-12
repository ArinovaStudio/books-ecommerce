"use client";

import { Card } from "@/components/ui/card";
import { MapPin, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { schools } from "@/data/demodata";

export default function SchoolsPage() {   

    const cities = [...new Set(schools.map((s) => s.city))];
    const [query, setQuery] = useState("");

    const filteredSchools = schools.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.city.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <section className="min-h-screen bg-[#f7f4f2]">
            <div className="bg-[#132345] text-white px-30 py-15">

                {/* Title */}
                <h1 className="text-4xl md:text-4xl font-bold ">Find Your School</h1>
                <p className="mt-3 text-md text-gray-200">
                    Search for your child's school to browse available book bundles and stationery kits.
                </p>

                {/* Search Bar */}
                <div className="mt-10 max-w-3xl">
                    <div className="bg-white w-full rounded-xl shadow p-4 flex items-center gap-3">

                        {/* Search Icon */}
                        <Search size={20} className="text-gray-500" />

                        <input
                            type="text"
                            placeholder="Search by school name, city, or pincode..."
                            className="w-full outline-none text-gray-600"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>

            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto  py-10 space-y-12">

                {cities.map((city) => {
                    const citySchools = filteredSchools.filter((s) => s.city === city);
                    if (citySchools.length === 0) return null;

                    return (
                        <div key={city} className="space-y-5">

                            {/* CITY HEADER */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {/* CITY NAME + ICON */}
                                    <div className="flex items-center gap-2">
                                        <MapPin size={18} className="text-blue-900" />
                                        <h2 className="text-xl font-semibold text-blue-950">
                                            {city}
                                        </h2>
                                        <span className="text-gray-500 text-sm font-medium">
                                            ({citySchools.length} Schools)
                                        </span>
                                    </div>
                                </div>


                            </div>


                            {/* GRID – 2 CARDS PER ROW */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {citySchools.map((school) => (
                                    <Link key={school.id} href={`/schools/${school.id}`}>
                                        <Card className="flex flex-row justify-between p-6 rounded-2xl bg-white shadow-sm border hover:shadow-md transition cursor-pointer w-xl hover:shadow-lg hover:-translate-y-1 group">

                                            {/* LEFT SECTION */}
                                            <div className="flex items-center gap-5">

                                                {/* ICON */}
                                                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-4xl  transition-all           group-hover:bg-gray-200">
                                                    🏫
                                                </div>

                                                {/* NAME + LOCATION */}
                                                <div>
                                                    <h3 className="text-lg font-semibold text-blue-950 leading-tight">
                                                        {school.name}
                                                    </h3>

                                                    {/* Location with icon */}
                                                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1 ">
                                                        <MapPin size={14} className="text-gray-500" />
                                                        {school.location}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ARROW */}
                                            <ChevronRight size={22} className="text-gray-500 transition-all            group-hover:translate-x-1 " />
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}

            </div>


        </section>
    );
}
