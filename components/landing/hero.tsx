import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Play } from "lucide-react"
import Image from "next/image"

export default function Hero() {
  return (
    // <section
    //   className="relative text-white py-12 md:py-24 overflow-hidden"
    //   style={{
    //     background: `
    //   radial-gradient(circle at 70% 40%, rgba(34,197,94,0.25), transparent 45%),
    //   radial-gradient(circle at 20% 30%, rgba(20,184,166,0.18), transparent 40%),
    //   linear-gradient(135deg, #052e2b 0%, #064e3b 50%, #022c22 100%)
    // `
    //   }}
    // >
    //   <svg
    //     className="absolute bottom-0 left-0 w-full h-24 text-white"
    //     viewBox="0 0 1200 120"
    //     preserveAspectRatio="none"
    //   >
    //     <path d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z" fill="currentColor" />
    //   </svg>

    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 relative z-10">
    //     <div className="pb-20 flex flex-col lg:flex-row items-center w-full gap-12">
    //       <div className="space-y-7 max-w-xl lg:max-w-4xl xl:max-w-4xl">
    //         {/* Badge */}
    //         <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/50 rounded-full px-4 py-2 w-fit">
    //           <span className="text-amber-400">🎁</span>
    //           <span className="text-sm text-amber-300">Save up to 20% on bundles</span>
    //         </div>

    //         {/* Headline */}
    //         <div className="space-y-7 max-w-xl lg:max-w-9xl">
    //           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
    //             School Books & Stationery
    //             {/* <br className="hidden md:block" /> */}
    //             <br />
    //             <span className="text-amber-400">Delivered to Your Door</span>
    //           </h1>
    //         </div>



    //         {/* Description */}
    //         <p className="text-lg text-blue-100 leading-relaxed max-w-xl">
    //           Get the complete book set and stationery kit for your child's school. Select your school, pick the class,
    //           and we'll handle the rest.
    //         </p>

    //         {/* CTA Buttons */}
    //         <div className="flex flex-col sm:flex-row gap-4 pt-4">
    //           <Button
    //             size="lg"
    //             className="bg-amber-500 hover:bg-amber-500 text-blue-900 font-semibold gap-2 rounded-xl py-7 px-9! cursor-pointer shadow-[0_0_50px_3px_rgba(255,193,7,0.25)] hover:shadow-none  transition-all duration-300"
    //           >

    //             Start Shopping <ArrowRight size={18} />
    //           </Button>

    //           <Button
    //             size="lg"
    //             variant="outline"
    //             className="border-2 border-white text-white hover:bg-white/10 hover:text-white font-semibold bg-transparent rounded-xl py-7 px-13 cursor-pointer"
    //           >
    //             Learn More
    //           </Button>
    //         </div>

    //         {/* Trust Indicators */}
    //         <div className="flex flex-col sm:flex-row gap-6 pt-6 text-sm">
    //           <div className="flex items-center gap-2">
    //             <CheckCircle size={20} className="text-amber-400" />
    //             <span className="text-blue-100">100% Authentic Books</span>
    //           </div>
    //           <div className="flex items-center gap-2">
    //             <CheckCircle size={20} className="text-amber-400" />
    //             <span className="text-blue-100">Free Delivery 500+</span>
    //           </div>
    //           <div className="flex items-center gap-2">
    //             <CheckCircle size={20} className="text-amber-400" />
    //             <span className="text-blue-100">Secure Payments</span>
    //           </div>
    //         </div>
    //       </div>
    //       {/* Right Image */}
    //       <div className="relative flex-1 flex justify-end items-center w-full h-[300px] md:h-[400px] lg:h-[600px] lg:min-w-[700px]">
    //         <Image
    //           src="/hero.png"
    //           alt="School stationery kit"
    //           fill
    //           priority
    //           className="object-contain object-top mx-29"
    //         />
    //       </div>
    //     </div>
    //   </div>
    // </section >


    <section className="relative overflow-hidden bg-gradient-to-br from-[#0c2f25] via-[#17340d] to-[#0a241c]">
      {/* Decorative blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-10 sm:top-24 right-6 sm:right-24 w-40 sm:w-64 h-40 sm:h-64 bg-green-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 sm:bottom-24 left-6 sm:left-16 w-40 sm:w-64 h-40 sm:h-64 bg-lime-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-0">

          {/* LEFT CONTENT */}
          <div className="space-y-8 sm:space-y-11 py-4 text-center lg:text-left">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-lime-400 tracking-wide uppercase">
                • LMS EDUCATION
              </p>
              <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-white leading-tight">
                Developing Thoughts <br className="hidden sm:block" /> for the Future
              </h1>
            </div>

            <p className="max-w-md mx-auto lg:mx-0 text-sm sm:text-base text-gray-300 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit proin leo sem,
              luctus turpis in, faucibus ridiculus diam.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <button className="px-7 py-3 rounded-full bg-lime-400 text-[#0c2f25] font-semibold hover:bg-lime-300 transition">
                Let’s Talk Us
              </button>

              <button className="px-7 py-3 rounded-full bg-white/10 text-white font-semibold flex items-center justify-center gap-3 hover:bg-white/20 transition">
                <div className="w-8 h-8 rounded-full bg-lime-400 flex items-center justify-center">
                  <Play className="text-black fill-black" size={12} />
                </div>
                How It Works
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center lg:justify-end mt-6 lg:mt-0">
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-lime-400/30 to-green-600/30 blur-2xl" />

              {/* Image */}
              <div className="relative rounded-full overflow-hidden border-4 border-lime-400/30 md:h-110">
                <img
                  src="/graduate-student-in-cap-and-gown-smiling.jpg"
                  alt="Graduate"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 sm:gap-6 mt-12 sm:mt-20">
          {["01", "02", "03", "04"].map((num, idx) => (
            <div key={num} className="flex items-center gap-2">
              <span
                className={`text-xs sm:text-sm font-semibold ${idx === 2 ? "text-lime-400" : "text-gray-400"
                  }`}
              >
                {num}
              </span>
              {idx !== 3 && (
                <span className="w-6 sm:w-10 h-px bg-white/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>


  )
}
