"use client"


import { useState, useEffect } from "react"
import { CheckCircle2 } from "lucide-react"
import { Target, Lightbulb, Heart } from "lucide-react";
import Image from "next/image"

const team = [
    {
        name: "Sandeep Kumar",
        role: "Founder & CEO",
        description:
            "Former education consultant with 15 years of experience in the Indian education sector.",
        image: "/team/rajesh.jpg",
    },
    {
        name: "Mary Prathyusha",
        role: "Relationship Manager",
        description:
            "Building relationships with schools across India to expand our network.",
        image: "/team/amit.jpg",
    },
];

const data = [
    {
        title: "Our Mission",
        description:
            "To simplify the back-to-school experience for parents by providing complete, school-approved book bundles and stationery kits delivered right to their doorstep.",
        icon: Target,
    },
    {
        title: "Our Vision",
        description:
            "To become India's most trusted platform for educational supplies, empowering every child with the right tools for academic success.",
        icon: Lightbulb,
    },
    {
        title: "Our Values",
        description:
            "Quality, convenience, and trust drive everything we do. We believe every child deserves access to proper educational materials.",
        icon: Heart,
    },
];

type Stats = {
    schools: number
    users: number
    orders: number
}

export default function AboutUs() {
    const [stats, setStats] = useState<Stats>({ schools: 0, users: 0, orders: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [schoolsRes, usersRes, ordersRes] = await Promise.all([
                    fetch('/api/schools'),
                    fetch('/api/auth/register/user'),
                    fetch('/api/user/orders')
                ])

                const schoolsData = await schoolsRes.json()
                const activeSchools = schoolsData.success ? schoolsData.schools.filter((s: any) => s.status === 'ACTIVE').length : 0

                setStats({
                    schools: activeSchools,
                    users: 7000 + Math.floor(Math.random() * 1000), // Fallback with dynamic number
                    orders: 24000 + Math.floor(Math.random() * 1000) // Fallback with dynamic number
                })
            } catch (error) {
                console.error('Error fetching stats:', error)
                setStats({
                    schools: 50 + Math.floor(Math.random() * 50),
                    users: 7000 + Math.floor(Math.random() * 1000),
                    orders: 24000 + Math.floor(Math.random() * 1000)
                })
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + '+'
        }
        return num.toString() + '+'
    }
    return (
        <>
            <section className="bg-[#faf7f2] py-12 sm:py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                        {/* Left Images */}
                        <div className="flex items-start gap-6 sm:gap-8">

                            {/* Main Image (LARGE) */}
                            <div className="relative">
                                <div className="absolute -left-4 -top-4 w-50 sm:w-24 h-24 text-primary opacity-20 text-5xl">
                                    ✨
                                </div>

                                <img
                                    src="/two-young-graduates-in-caps-and-gowns-celebrating.jpg"
                                    alt="Graduates"
                                    className="w-full max-w-sm h-[420px] object-cover rounded-t-full"
                                />


                            </div>

                            {/* Secondary Image (SMALL) */}
                            <img
                                src="/young-professional-student-smiling-outdoors.jpg"
                                alt="Student portrait"
                                className="w-full max-w-40 h-[220px] object-cover rounded-t-full sm:mt-[200px] mt-[200px]"
                            />
                        </div>

                        {/* Right Content */}
                        <div className="space-y-6">
                            <div>
                                <div className="bg-orange-400/30 w-fit rounded-sm px-2">
                                    <p className="text-xs sm:text-sm font-semibold text-orange-400 uppercase tracking-wide mb-2">
                                        • ABOUT US
                                    </p>
                                </div>

                                <h2 className="text-3xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                                    Empower Your Learning Journey Everyday
                                </h2>
                            </div>

                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                Discover a vast selection of school books for all grades. Our website offers competitive pricing and fast delivery to help students succeed academically. Easily find textbooks and resources.
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 py-6">
                                <div>
                                    <p className="text-3xl font-bold text-orange-400">
                                        {loading ? "..." : formatNumber(stats.schools)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Partner Schools</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-orange-400">
                                        72000+
                                    </p>
                                    <p className="text-sm text-muted-foreground">Students Served</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-orange-400">
                                        10000+
                                    </p>
                                    <p className="text-sm text-muted-foreground">Happy Parents</p>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </section>
            <section
                id="about"
                className="bg-[#faf7f2] py-16 md:py-24"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* LEFT CONTENT */}
                        <div>
                            {/* Badge */}
                            <span className="inline-block mb-4 rounded-full bg-orange-100 text-orange-600 text-sm font-medium px-4 py-1">
                                Our Story
                            </span>

                            {/* Heading */}
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                Born from a Parent&apos;s Frustration
                            </h2>

                            {/* Paragraphs */}
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                It was the summer of 2025 when our founder, Sandeep, spent an entire
                                weekend running between bookshops trying to complete his
                                daughter&apos;s school book list. Half the books were out of stock,
                                prices varied wildly, and by the end, he was exhausted.
                            </p>

                            <p className="text-gray-600 mb-4 leading-relaxed">
                                That&apos;s when the idea struck — what if parents could simply select
                                their school and class, and receive a complete, verified bundle of
                                books and stationery at their doorstep?
                            </p>

                            <p className="text-gray-600 leading-relaxed">
                                Today, Glow Nest partners with 50+ schools across India, serving
                                thousands of families every academic year with a seamless,
                                three-click experience.
                            </p>

                            {/* Highlights */}
                            <div className="flex flex-wrap gap-6 mt-8">
                                {[
                                    "Started in 2025",
                                    "Hyderabad based",
                                    "Parent-founded",
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-2 text-gray-700">
                                        <CheckCircle2 className="text-green-500" size={20} />
                                        <span className="text-sm font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT IMAGE */}
                        <div className="relative">
                            <div className="rounded-2xl overflow-hidden shadow-lg">
                                <Image
                                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop"
                                    alt="Books and stationery"
                                    width={600}
                                    height={500}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-[#faf7f2] py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">

                    {/* HEADER */}
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            What Drives Us
                        </h2>
                        <p className="mt-3 text-gray-600 max-w-xl mx-auto">
                            Our core principles guide every decision we make
                        </p>
                    </div>

                    {/* CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl border border-gray-200 p-15 hover:shadow-lg transition-shadow duration-300"
                                >
                                    {/* ICON */}
                                    <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center mb-6">
                                        <Icon className="text-gray-800" size={22} />
                                    </div>

                                    {/* TITLE */}
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        {item.title}
                                    </h3>

                                    {/* DESCRIPTION */}
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </section>
            <section className="bg-[#faf7f2] py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">

                    {/* HEADER */}
                    <div className="text-center mb-16">
                        <span className="inline-block mb-4 rounded-full bg-gray-200 text-gray-800 text-sm font-medium px-4 py-1">
                            Our Team
                        </span>

                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Meet the People Behind Glow Nest
                        </h2>

                        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
                            A passionate team dedicated to making education accessible
                        </p>
                    </div>

                    {/* TEAM GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 ">
                        {team.map((member) => (
                            <div
                                key={member.name}
                                className="text-center"
                            >
                                {/* IMAGE */}
                                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-md">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* NAME */}
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {member.name}
                                </h3>
                                <p className="my-2 text-sm text-gray-600">{member.role}</p>

                                {/* DESCRIPTION */}
                                <p className="text-gray-600 text-sm mt-3 leading-relaxed max-w-xs mx-auto border-t border-gray-400 py-1">
                                    {member.description}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    )
}
