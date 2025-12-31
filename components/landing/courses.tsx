import Image from "next/image";
import { Button } from "../ui/button";
import { JSX } from "react";

const courseCards = [
  {
    title: "Select Your School",
    description: "Choose from our list of partnered schools across India",
    image: "/school.png",
    bgColor: "#F68B4B" as const,
    doodle: "wings" as const,
    layout: "text-bottom" as const,
  },
  {
    title: "Select Class",
    description: "Select the class and choose from book or stationery bundles",
    image: "/notebooks.png",
    bgColor: "#1E7F4D" as const,
    doodle: "scribble" as const,
    layout: "text-bottom" as const,
  },
  {
    title: "Make Payment",
    description: "Review your order and complete the payment in just one click",
    image: "/cart.png",
    bgColor: "#4A92C6" as const,
    doodle: "cloud" as const,
    layout: "text-top" as const,
  },
  {
    title: "Doorstep Delivery",
    description: "Get your order delivered right to your doorstep",
    image: "/delivery.png",
    bgColor: "#fdc700" as const,
    doodle: "circle" as const,
    layout: "text-top" as const,
  },
];

type Props = {
  type: "cloud" | "scribble" | "wings" | "star" | "circle" | "arrow";
  className?: string;
};

const DOODLES: Record<Props["type"], JSX.Element> = {
  cloud: (
    <svg viewBox="0 0 100 60" fill="none">
      <path
        d="M20 45C10 45 5 38 5 30C5 22 12 15 22 15C22 8 30 2 42 2C54 2 65 10 65 22C75 22 85 28 85 38C85 48 75 55 62 55C50 55 25 55 20 45Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 4"
        fill="none"
      />
    </svg>
  ),

  scribble: (
    <svg viewBox="0 0 100 100" fill="none">
      <path
        d="M10 50C20 30 40 20 60 30C80 40 90 60 70 80C50 100 20 90 10 70"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M30 40C40 35 55 35 65 45"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  ),

  wings: (
    <svg viewBox="0 0 120 60" fill="none">
      <path
        d="M60 30C50 20 30 15 10 25C30 20 45 25 55 35"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M60 30C70 20 90 15 110 25C90 20 75 25 65 35"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  ),

  star: (
    <svg viewBox="0 0 50 50" fill="none">
      <path
        d="M25 5L30 20H45L33 30L38 45L25 35L12 45L17 30L5 20H20L25 5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),

  circle: (
    <svg viewBox="0 0 50 50" fill="none">
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 4"
        fill="none"
      />
    </svg>
  ),

  arrow: (
    <svg viewBox="0 0 60 40" fill="none">
      <path
        d="M5 20C15 20 35 20 50 20M50 20L40 10M50 20L40 30"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
};

function Doodle({ type, className }: Props) {
  return (
    <span className={className}>
      {DOODLES[type]}
    </span>
  );
}


export default function Courses() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 flex justify-center ">
          <div className="">
            <h2 className="text-5xl  font-bold text-gray-900 mb-4">
              How It <span className="text-[#4169B4]">Works</span>
            </h2>
            <p className="text-gray-600 mb-8 text-left">
              Learn amazing with us. We teach 'One Smart Lesson' at a time!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {courseCards.map((card, index) => (
            <div
              key={index}
              className="relative h-[380px] overflow-hidden rounded-tr-4xl rounded-bl-4xl transition-transform duration-300 hover:-translate-y-2"
              style={{ backgroundColor: card.bgColor }}
            >
              {/* Text */}
              <div
                className={`absolute ${card.layout === "text-top"
                    ? "top-6 left-6"
                    : "bottom-6 left-6"
                  } text-white max-w-[180px] leading-snug z-10`}
              >
                <h3 className="font-bold text-lg">{card.title}</h3>
                <h6 className="text-sm">{card.description}</h6>
              </div>

              {/* Main doodle */}
              <Doodle
                type={card.doodle}
                className={`absolute top-0  w-28 opacity-60 z-10 ${card.layout === "text-bottom"
                    ? "left-6"
                    : "right-1 top-5"
                  }`}
              />

              {/* Star doodle bottom-left */}
              <Doodle
                type="star"
                className={`absolute bottom-4  w-6 opacity-70 z-30  ${card.layout === "text-bottom"
                    ? "right-4"
                    : "left-4"
                  }`}
              />

              {/* Image */}
              <Image
                src={card.image}
                alt={card.title}
                fill
                className={`object-contain z-20 drop-shadow-2xl ${card.layout === "text-bottom"
                    ? "object-top mt-5"
                    : "object-bottom"
                  }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
