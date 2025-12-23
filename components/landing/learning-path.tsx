import Image from "next/image";

export default function Learning() {


    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Heading */}
                <div className="relative text-center mb-16">

                    {/* TEXT */}
                    <p className="text-sm text-orange-500 font-semibold mb-2">
                        We focus on one impact at a time
                    </p>

                    <h2 className="text-4xl font-bold text-gray-900">
                        Shaping the <span className="text-orange-500">future</span> of kids
                    </h2>

                    {/* POPPING IMAGE */}
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2">
                        <Image
                            src="/boy-bbok.png"
                            alt="Happy Kid"
                            width={140}
                            height={140}
                            className="-translate-y-10 object-contain"
                        />
                    </div>

                </div>


                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
                    {[
                        {
                            title: "Letter Identification",
                            subtitle: "Class - Pre School",
                            color: "#4CC9F0",
                            img: "/child-student-portrait.png",
                        },
                        {
                            title: "General Knowledge",
                            subtitle: "Fourth Grade",
                            color: "#FF9F1C",
                            img: "/child-student-portrait.png",
                        },
                        {
                            title: "Geography Quiz",
                            subtitle: "First Grade",
                            color: "#2EC4B6",
                            img: "/child-student-portrait.png",
                        },
                        {
                            title: "Visual Arts Training",
                            subtitle: "Sketching class",
                            color: "#FFD166",
                            img: "/child-student-portrait.png",
                        },
                    ].map((item, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center">

                            {/* SVG BACKGROUND */}
                            <svg
                                width="180"
                                height="180"
                                viewBox="0 0 200 200"
                                className="z-0"
                            >
                                <path
                                    fill={item.color}
                                    d="M40,-60C55,-52,72,-45,78,-32C85,-18,80,2,71,20C61,38,46,55,28,63C10,71,-10,70,-28,63C-46,56,-62,43,-70,25C-78,6,-78,-19,-67,-36C-55,-53,-33,-61,-12,-66C9,-71,28,-68,40,-60Z"
                                    transform="translate(100 100)"
                                />
                            </svg>

                            {/* POPPING IMAGE */}
                            <Image
                                src={item.img}
                                alt={item.title}
                                width={200}
                                height={220}
                                className="object-contain w-50 h-50 absolute flex justify-center -top-12 z-10"
                            />


                            {/* TEXT */}
                            <div className="">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {item.subtitle}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>

    )
}