"use client"

import { ArrowRight } from "lucide-react"

export default function AboutUs() {
    return (
        <section className="py-12 sm:py-16 lg:py-24">
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

                            {/* Experience Badge */}
                            <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground rounded-full w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center font-bold text-center p-2">
                                <span className="text-2xl sm:text-3xl">25</span>
                                <span className="text-xs sm:text-sm">Years of</span>
                                <span className="text-xs sm:text-sm">experience</span>
                            </div>
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

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                                Empower Your Learning Journey Everyday
                            </h2>
                        </div>

                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 py-6">
                            <div>
                                <p className="text-3xl font-bold text-orange-400">5k+</p>
                                <p className="text-sm text-muted-foreground">Online Classes</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-orange-400">7k+</p>
                                <p className="text-sm text-muted-foreground">Students each year</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-orange-400">24+</p>
                                <p className="text-sm text-muted-foreground">Award Winning</p>
                            </div>
                        </div>

                        <button className="group px-6 py-3 bg-orange-400 text-primary-foreground font-semibold rounded-none rounded-tr-2xl rounded-bl-2xl flex items-center gap-2 transition-all duration-300 ease-out hover:bg-orange-400/90 hover:scale-105 cursor-pointer">
                            View More Details
                            <ArrowRight size={16} className="transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
                        </button>
                    </div>

                </div>
            </div>
        </section>

    )
}
