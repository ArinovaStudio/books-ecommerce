import {
    CheckCircle,
    IndianRupee,
    Clock,
    Package,
    RefreshCw,
    Headphones,
} from "lucide-react";

const kidsData = [
    {
        title: "100% Genuine Products",
        description:
            "All books are sourced directly from authorized publishers and distributors",
        icon: CheckCircle,
        blobColor: "#d6f0ff",
    },
    {
        title: "Best Bundle Pricing",
        description:
            "Transparent pricing on complete book sets and stationery kits",
        icon: IndianRupee,
        blobColor: "#ffe2c6",
    },
    {
        title: "Quick Delivery",
        description:
            "Get your order delivered within 4-7 business days across India",
        icon: Clock,
        blobColor: "#e2f6e9",
    },
    {
        title: "Secure Packaging",
        description:
            "Books are carefully packed to ensure they reach you in perfect condition",
        icon: Package,
        blobColor: "#ffe2c6",
    },
    {
        title: "Easy Returns",
        description: "Hassle-free return policy within 9 days of delivery",
        icon: RefreshCw,
        blobColor: "#e2f6e9",
    },
    {
        title: "Dedicated Support",
        description:
            "Our customer support team is available to help you via phone and email",
        icon: Headphones,
        blobColor: "#d6f0ff",
    },
];

type BlobProps = {
    color: string;
    className?: string;
};

function Blob({ color, className }: BlobProps) {
    return (
        <svg
            viewBox="0 0 200 200"
            className={`${className} absolute inset-0 
             transition-transform duration-500 ease-in-out
             group-hover:scale-115 group-hover:rotate-2`}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
        >
            <path
                fill={color}
                d="
          M40,-60
          C55,-45,65,-30,70,-10
          C75,10,75,30,65,45
          C55,60,35,70,15,72
          C-5,74,-25,70,-45,60
          C-65,50,-85,35,-90,15
          C-95,-5,-85,-25,-70,-40
          C-55,-55,-30,-70,-5,-72
          C20,-74,35,-75,40,-60
          Z
        "
                transform="translate(100 100)"
            />
        </svg>
    );
}


export default function KidsFutureSection() {
    return (
        <section className="py-24 px-6 text-center bg-[#fffaf2]">
            <p className="text-sm text-gray-500 mb-2">
                We focus on one impactful lesson at a time
            </p>

            <h2 className="text-5xl font-bold mb-7 text-gray-800">
                Why Parents <span className="text-[#4169B4]">Trust </span>Us
            </h2>

            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-20 ">
                {kidsData.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <div key={index} className="relative flex justify-center">
                            {/* FLOATING BLOB */}
                            <div className="relative w-[270px] h-[240px] group ">
                                <Blob
                                    color={item.blobColor}
                                    className="absolute inset-0 "
                                />

                                {/* ICON + TEXT */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none">
                                    <Icon
                                        className="w-14 h-14 text-gray-700 mb-3"
                                        strokeWidth={1.8}
                                    />

                                    <h4 className="text-base font-semibold text-black leading-snug">
                                        {item.title}
                                    </h4>

                                    <p className="text-sm font-semibold text-gray-700 mt-2 leading-relaxed w-70">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>

    );
}
