"use client"

import React from 'react'
import { ArrowLeft, MapPin } from "lucide-react";
import { schools } from "@/data/demodata";
import Link from "next/link";
import { useRouter } from "next/navigation";


interface ClassItem {
    id: number;
    name: string;
}

export default function SchoolClassesPage({ params }: { params: Promise<{ schoolId: number }> }) {
    const { schoolId } = React.use(params)
    const numericId = Number(schoolId);
    const school = schools.find((s) => s.id === numericId);

    const router = useRouter();

    if (!school) {
        return <div className="p-10 text-red-600">School not found</div>;
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
    ];



    return (
        <section className="min-h-screen bg-gray-50 ">

            {/* HEADER */}
            <div className="bg-blue-950 py-10 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-200 hover:text-white transition cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                        Back to Schools
                    </button>

                    {/* SCHOOL HEADER */}
                    <div className="mt-6 flex items-center gap-5">
                        {/* Icon */}
                        <div className="w-20 h-20 rounded-2xl bg-blue-900 flex items-center justify-center text-5xl">
                            🏫
                        </div>

                        {/* Name + location */}
                        <div>
                            <h1 className="text-3xl font-semibold text-white">
                                {school.name}
                            </h1>

                            <p className="flex items-center gap-2 text-gray-300 mt-1">
                                <MapPin size={18} className="text-gray-300" />
                                {school.location}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="bg-gray-50 py-10 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-blue-950 mb-6">
                        Select Class
                    </h2>

                    {/* Classes Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {classes.map((data) => (
                            <Link key={data.id}
                                href={`/schools/${schoolId}/${data.id}`}
                                className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
                            >
                                <h3 className="flex justify-center text-md font-medium">{data.name}</h3>

                            </Link>
                        ))}
                    </div>

                </div>
            </div>

        </section>

    );
}
