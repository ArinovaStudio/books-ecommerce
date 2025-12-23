import Image from 'next/image'
import React from 'react'

export default function event() {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto relative">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center">

                    {/* LEFT IMAGE CARD */}
                    <div className="bg-green-600 overflow-hidden flex items-center justify-center text-white
                      rounded-none rounded-tr-3xl rounded-bl-3xl
                      max-h-[260px]">
                        <Image
                            src="/parent-child-reading-book-together-family.jpg"
                            alt="Parent and Child"
                            width={400}
                            height={256}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* RIGHT CONTENT CARD (OVERLAP) */}
                    <div className="bg-yellow-400 p-8
                      rounded-none rounded-t-3xl
                      min-h-[260px]
                      md:-ml-12 z-10 relative">
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
