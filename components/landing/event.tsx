import Image from 'next/image'
import React from 'react'

export default function event() {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto relative">
                <div className="grid grid-cols-1 md:grid-cols-[5fr_5fr] items-center">
                    {/* LEFT IMAGE CARD  */}
                    <div className="relative bg-green-600 overflow-visible rounded-none rounded-tr-3xl rounded-bl-3xl h-[260px] flex justify-center">
                        <div className="relative h-[312px] w-[510px] -translate-y-13 ">
                            <Image
                                src="/kid-mom.png"
                                alt="Parent and Child"
                                fill
                                className="object-fit "
                            />
                        </div>
                    </div>

                    {/* RIGHT CONTENT CARD */}
                    <div className="bg-yellow-400 p-10 rounded-none rounded-t-3xl min-h-[260px] md:-ml-40 z-10 relative">
                        <span className="text-xs font-semibold text-yellow-900 bg-yellow-200 px-3 py-1 rounded-full">
                            Upcoming Event
                        </span>

                        <h3 className="text-3xl font-bold text-gray-900 my-4">
                            Building children one at a time
                        </h3>

                        <p className="text-gray-800 mb-6">
                            Celebrate these from the foundation of knowledge
                        </p>

                        <div className="flex items-center gap-2 text-gray-800 font-semibold">
                            <span>📅</span>
                            <span>07 March 2025</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>

    )
}
