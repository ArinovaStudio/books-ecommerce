import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'

export default function cta() {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-6 mb-16">
                {/* Yellow CTA */}
                <div className="relative bg-yellow-400 p-14 flex justify-between rounded-none rounded-tr-3xl rounded-bl-3xl overflow-visible w-full">
                    {/* LEFT CONTENT */}
                    <div className="max-w-[380px]">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Confidence that builds a brighter future.
                        </h3>
                        <p className="text-gray-800 text-sm mb-6">
                            Empowering kids with self-confidence to face the world
                        </p>
                        <Button className="bg-gray-900 hover:bg-gray-800 text-white w-fit rounded-none rounded-tr-2xl rounded-bl-2xl px-6">
                            Book Now →
                        </Button>
                    </div>

                    {/* RIGHT POPPING IMAGE */}
                    <div className="absolute right-0 -top-16 w-[300px] h-[340px]">
                        <Image src="/boy-books.png" alt="boy" fill className="object-contain" />
                    </div>
                </div>

                {/* Orange CTA */}
                <div className="bg-orange-500 p-12 flex flex-col justify-between text-white rounded-none rounded-tr-3xl rounded-bl-3xl">
                    <div>
                        <h3 className="text-2xl font-bold mb-4">
                            Helping kids to shoot their dreams.
                        </h3>
                        <p className="text-orange-100 text-sm mb-6">
                            Turning aspirations into achievable goals for students
                        </p>
                    </div>
                    <Button className="bg-white hover:bg-gray-100 text-orange-500 w-fit rounded-none rounded-tr-2xl rounded-bl-2xl px-6">
                        Learn More →
                    </Button>
                </div>
            </div>


            {/* Testimonial Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto mt-40">

                <div>
                    <p className="text-sm text-gray-600 mb-4">Admission on going</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">Empower your kids to think be smarter and sharper</h3>
                    <p className="text-gray-600 mb-8">
                        Encourage kids to think critically, be creative, and solve problems for a better future.
                    </p>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-none rounded-tr-2xl rounded-bl-2xl px-6">Get Educated →</Button>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="flex items-center gap-3">
                            <div className="text-2xl">✓</div>
                            <div>
                                <p className="font-bold text-gray-900">45M+</p>
                                <p className="text-sm text-gray-600">Learners have reached across the globe</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-2xl">☀️</div>
                            <div>
                                <p className="font-bold text-gray-900">164+</p>
                                <p className="text-sm text-gray-600">Nations participating in the program</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative bg-blue-500/80 overflow-visible h-96 flex items-end justify-center rounded-none rounded-tr-4xl rounded-bl-4xl">

                    <Image
                        src="/happy-student-girl-confident-smiling.png"
                        alt="Happy Student"
                        width={400}
                        height={300}
                        className="w-full h-130 object-contain drop-shadow-lg"
                    />


                </div>

            </div>
        </section>
    )
}
