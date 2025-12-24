import Image from "next/image";
import { Button } from "../ui/button";

const courseCards = [
    {
        title: "Life Skills for Kids",
        image: "/student-book.png",
        bgColor: "#F68B4B",
        doodle: "cloud",
        textPosition: "middle",
    },
    {
        title: "Imagination is power",
        image: "/kid-skateboard.png",
        bgColor: "#1E7F4D",
        doodle: "scribble",
        textPosition: "bottom",
    },
    {
        title: "Grow your own wings",
        image: "/student-bag.png",
        bgColor: "#4A92C6",
        doodle: "wings",
        textPosition: "top",
    },
];

type Props = {
    type: "cloud" | "scribble" | "wings";
    className?: string;
};

function Doodle({ type, className }: Props) {
    if (type === "cloud") {
        return (
            <svg viewBox="0 0 120 60" className={className} fill="none">
                <path
                    d="M20 40c-8 0-15-6-15-14S12 12 20 12c2-8 10-12 18-10 6-6 16-4 20 4 10 0 18 8 18 18s-8 16-18 16H20z"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </svg>
        );
    }

    if (type === "scribble") {
        return (
            <svg viewBox="0 0 120 120" className={className} fill="none">
                <path
                    d="M20 60c20-40 60-40 80 0s-20 40-40 20-20-60 0-80"
                    stroke="#FFD54F"
                    strokeWidth="4"
                    strokeLinecap="round"
                />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 140 80" className={className} fill="none">
            <path
                d="M20 60c20-30 40-30 60 0M60 60c20-30 40-30 60 0"
                stroke="#B3E5FC"
                strokeWidth="4"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default function Courses() {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 flex justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Smart and clever kids ready to fly high!</h2>
                        <p className="text-gray-600 mb-8">Learn amazing with us. We teach 'One Smart Lesson' at a time!</p>
                    </div>
                    <Button className="bg-orange-400 hover:bg-orange-400/90 text-white rounded-none rounded-tr-2xl rounded-bl-2xl px-6">Enroll Now →</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {courseCards.map((card, index) => (
                        <div
                            key={index}
                            className="relative h-[380px] overflow-hidden rounded-tr-4xl rounded-bl-4xl transition-transform duration-300 hover:-translate-y-2"
                            style={{ backgroundColor: card.bgColor }}
                        >
                            {/* Title */}
                            <h3
                                className={`absolute ${card.textPosition === "top"
                                    ? "top-6 left-6" : card.textPosition === "middle" ? "top-36 left-6"
                                        : "bottom-6 left-6"
                                    } text-white text-2xl font-serif max-w-[180px] leading-snug z-10`}
                            >
                                {card.title}
                            </h3>

                            {/* Doodle */}
                            <Doodle
                                type={card.doodle}
                                className="absolute top-0 left-6 w-28 opacity-60 z-10"
                            />

                            {/* Image */}
                            <Image
                                src={card.image}
                                alt={card.title}
                                fill
                                className="object-contain object-bottom z-0"
                            />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}
