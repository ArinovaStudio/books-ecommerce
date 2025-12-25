import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'

export default function cta() {
    return (
        <section id='contact' className="pt-16 px-4 sm:px-6 lg:px-8">
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
                        <Button className="group bg-gray-900 hover:bg-gray-900/90 text-white w-fit rounded-none rounded-tr-2xl rounded-bl-2xl px-6 py-7 flex items-center gap-2 transition-transform duration-300 ease-out hover:scale-105 cursor-pointer">
                            Browse Schools
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1.5" strokeWidth={2} />
                        </Button>

                    </div>

                    {/* RIGHT POPPING IMAGE */}
                    <div className="absolute right-0 -top-16 w-[300px] h-[375px]">
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
                    <div>Any issues?
                        <Button className="group bg-white hover:bg-white text-orange-500 w-fit rounded-none rounded-tr-2xl rounded-bl-2xl px-6 py-3 flex items-center gap-2 transition-transform duration-300 ease-out hover:scale-105 cursor-pointer"> Contact us
                            <ArrowRight
                                className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1.5"
                                strokeWidth={2}
                            />
                        </Button></div>

                </div>
            </div>

        </section>
    )
}
