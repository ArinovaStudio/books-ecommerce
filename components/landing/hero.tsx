import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  return (
    <section
      id='home'
      className="relative overflow-hidden bg-[linear-gradient(135deg,#141f38_0%,#22345e_50%,#1f5c7a_100%)] text-white"
    >
      {/* Decorative blobs for added depth on the new gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-10 sm:top-24 right-6 sm:right-24 w-40 sm:w-64 h-40 sm:h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 sm:bottom-24 left-6 sm:left-16 w-40 sm:w-64 h-40 sm:h-64 bg-cyan-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-0">

          {/* LEFT CONTENT */}
          <div className="space-y-8 sm:space-y-11 py-4 text-center lg:text-left">
            <div>
              <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-white leading-tight tracking-tight">
                School Books & Stationery, Delivered to Your Door
              </h1>
            </div>

            <p className="max-w-md mx-auto lg:mx-0 text-sm sm:text-base text-blue-100/70 leading-relaxed">
              Get the complete book set and stationery kit for your child's school. Select your school, pick the class, and we'll handle the rest.
            </p>

            {/* Buttons */}
            <div className="flex flex-col items-center sm:flex-row justify-center lg:justify-start gap-4">
              <Link href="/schools">
                <button className="px-7 py-3 cursor-pointer rounded-full bg-cyan-400 text-white/90 font-bold hover:bg-cyan-300 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                  Browse Schools
                </button>
              </Link>

              <button className="px-7 py-3 bg-red-400 rounded-full bg-white/5 border border-white/10 text-white font-semibold flex items-center justify-center gap-3 hover:bg-white/10 transition">
                <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center shadow-lg">
                  <Play className="text-[#141f38] fill-[#141f38]" size={12} />
                </div>
                Learn More
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE - OVAL SHAPE */}
          <div className="relative flex justify-center lg:justify-end mt-6 lg:mt-0">
            {/* Changed aspect-[3/4] to aspect-square to ensure width equals height */}
            <div className="relative w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-96 lg:w-80 lg:h-96 aspect-square">

              {/* Circular Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 blur-2xl animate-pulse" />

              {/* Circular Image Container */}
              <div className="relative h-full w-full rounded-full overflow-hidden border-4 border-cyan-400/20 shadow-2xl">
                <img
                  src="/24985 boy.jpg"
                  alt="Student with school supplies"
                  className="w-full h-full object-cover scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}