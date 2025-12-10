import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

export default function Hero() {
  return (
    <section className="bg-linear-to-br from-blue-950 via-blue-800 to-blue-300
text-white py-12 md:py-24 relative overflow-hidden">
      <svg
        className="absolute bottom-0 left-0 w-full h-24 text-white"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z" fill="currentColor" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 relative z-10">
        <div className="grid md:grid-cols-2 gap-20 items-center pb-20 justify-between">

          {/* Left Content */}
          <div className="space-y-7 ">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/50 rounded-full px-4 py-2 w-fit">
              <span className="text-amber-400">🎁</span>
              <span className="text-sm text-amber-300">Save up to 20% on bundles</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              School Books & Stationery, <span className="text-amber-400">Delivered</span> to Your Door
            </h1>

            {/* Description */}
            <p className="text-lg text-blue-100 leading-relaxed max-w-xl">
              Get the complete book set and stationery kit for your child's school. Select your school, pick the class,
              and we'll handle the rest.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-500 text-blue-900 font-semibold gap-2 rounded-xl py-7 px-9! cursor-pointer shadow-[0_0_50px_3px_rgba(255,193,7,0.25)] hover:shadow-none  transition-all duration-300"
              >

                Start Shopping <ArrowRight size={18} />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 hover:text-white font-semibold bg-transparent rounded-xl py-7 px-13 cursor-pointer"
              >
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row gap-6 pt-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-amber-400" />
                <span className="text-blue-100">100% Authentic Books</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-amber-400" />
                <span className="text-blue-100">Free Delivery 500+</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-amber-400" />
                <span className="text-blue-100">Secure Payments</span>
              </div>
            </div>
          </div>

          {/* Right Visual - Product Card */}
          <div className="hidden md:flex justify-center">
            <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full">
              <div className="absolute left-150 bg-amber-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                20% OFF
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-blue-900">Class 5 Bundle</h3>
                <p className="text-sm text-gray-600">Delhi Public School</p>

                <div className="space-y-3 py-4 border-y border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Books (8)</span>
                    <span className="font-semibold text-gray-900">₹450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Stationery Kit</span>
                    <span className="font-semibold text-gray-900">₹350</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span className="font-semibold">Bundle Discount</span>
                    <span className="font-bold">-₹100</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-700 text-sm">Total</p>
                  <p className="text-4xl font-bold text-blue-900">₹700</p>
                </div>

                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-blue-900 font-bold py-6 rounded-lg">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}
