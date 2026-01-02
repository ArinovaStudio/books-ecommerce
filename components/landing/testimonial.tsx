"use client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Ananya Sharma",
        role: "Parent, Class 3",
        text: "This platform has transformed the way my child learns. The structured content and engaging lessons boosted confidence within weeks.",
        rating: 5,
        image: "/happy-student-girl-confident-smiling.png",
    },
    {
        name: "Rohan Mehta",
        role: "Parent, Class 5",
        text: "Excellent curriculum and amazing support. My son now enjoys learning instead of avoiding it. The progress has been remarkable.",
        rating: 5,
        image: "/student-book.png",
    },
    {
        name: "Priya Verma",
        role: "Parent, Class 2",
        text: "The lessons are simple, engaging, and age-appropriate. My daughter looks forward to learning every day now.",
        rating: 5,
        image: "/student-bag.png",
    },
    {
        name: "Amit Kapoor",
        role: "Parent, Class 6",
        text: "A perfect balance of academics and creativity. The step-by-step approach really helped my child understand concepts better.",
        rating: 5,
        image: "/sketch.png",
    },
    {
        name: "Neha Singh",
        role: "Parent, Class 4",
        text: "I love how organized and well-planned the lessons are. It has reduced study stress and improved learning outcomes.",
        rating: 5,
        image: "/forth.png",
    },
];

export default function TestimonialSection() {
    const [active, setActive] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setActive((prev) => prev + 1);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (active === testimonials.length) {
            setTimeout(() => {
                setIsTransitioning(false);
                setActive(0);
            }, 700);
        }
    }, [active]);

    const displayActive = active % testimonials.length;

    return (
        <section className="pt-16 pb-30 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* heading */}
                <div className="text-center mb-20">
                    <p className="text-sm text-gray-600 mb-4">Trusted by parents worldwide</p>
                    <h3 className="text-5xl font-bold text-black mb-6">
                        What Parents Say <span className="text-[#4169B4]">About</span> Us
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* LEFT CONTENT */}
                    <div>
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-4">
                            {[...Array(testimonials[displayActive].rating)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">5.0 Rating</span>
                        </div>

                        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                            "{testimonials[displayActive].text}"
                        </p>

                        <div className="mb-6">
                            <p className="font-semibold text-gray-900">
                                {testimonials[displayActive].name}
                            </p>
                            <p className="text-sm text-gray-600">
                                {testimonials[displayActive].role}
                            </p>
                        </div>

                        {/* Dots */}
                        <div className="flex gap-2">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setIsTransitioning(true);
                                        setActive(i);
                                    }}
                                    className={`w-3 h-3 rounded-full transition ${displayActive === i ? "bg-orange-500" : "bg-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT IMAGE SLIDER */}
                    <div className="relative bg-blue-500/80 h-80 flex items-start justify-center rounded-tr-[4rem] rounded-bl-[4rem] overflow-hidden">
                        <div
                            className={`flex h-80 ${isTransitioning ? 'transition-transform duration-700 ease-out' : ''}`}
                            style={{ transform: `translateX(-${active * 100}%)` }}
                        >
                            {[...testimonials, testimonials[0]].map((item, i) => (
                                <div key={i} className="relative min-w-full h-80 flex justify-center items-end">
                                    {/* TALLER IMAGE CONTAINER OVERFLOWING FROM TOP */}
                                    <div className="relative w-96 h-[20rem] flex items-end justify-center">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="object-contain object-bottom drop-shadow-xl max-w-full max-h-full h-[36rem]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}