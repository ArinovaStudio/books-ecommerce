import Image from "next/image";

const kidsData = [
    {
        title: "Letter Identification",
        subtitle: "Class - Pre School",
        image: "/preschool.png",
        blobColor: "#d6f0ff",
    },
    {
        title: "General Knowledge",
        subtitle: "Fourth Grade",
        image: "/forth.png",
        blobColor: "#ffe2c6",
    },
    {
        title: "Geography Quiz",
        subtitle: "First Grade",
        image: "/child-student-portrait.png",
        blobColor: "#e2f6e9",
    },
    {
        title: "Visual Arts Training",
        subtitle: "Sketching class",
        image: "/sketch.png",
        blobColor: "#fff2c9",
    },
];


export default function KidsFutureSection() {
    return (
        <section className=" py-20 px-6 text-center">
            <p className="text-sm text-gray-500 mb-2">
                We focus on one impactful lesson at a time
            </p>

            <h2 className="text-4xl md:text-[42px] font-bold mb-40 text-gray-800">
                Shaping the <span className="text-orange-500">future</span> of kids
            </h2>

            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
                {kidsData.map((item, index) => (
                    <div className="relative text-center" key={index}>
                        {/* FLOATING WRAPPER */}
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[170px] h-[170px]">
                            {/* BLOB BACKGROUND */}
                            <svg
                                viewBox="0 0 200 200"
                                className="absolute inset-0"
                                xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="none"
                            >
                                <path
                                    fill={item.blobColor}
                                    d="
      M 20 40
      C 20 10, 60 0, 100 10
      C 140 0, 180 20, 180 50
      C 180 80, 150 100, 100 110
      C 50 100, 20 80, 20 50
      L 20 160
      L 180 160
      Z
    "
                                />
                            </svg>

                            <div
                                className="absolute inset-0 -top-15 w-[195px] h-[195px]"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>


                        </div>
                        {/* TEXT */}
                        <div className="pt-20">
                            <h4 className="text-lg font-semibold">{item.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
                        </div>
                    </div>

                ))}
            </div>
        </section>
    );
}
