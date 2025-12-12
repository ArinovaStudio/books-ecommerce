import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HeroCTA() {
  return (
    <section id="contact" className="bg-[#15203b] text-white py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold leading-tight text-balance">Ready to Get Started?</h2>

        {/* Description */}
        <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Join thousands of parents who trust StreamLine for their child's school supplies. Start shopping today and
          save big on bundles.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-500 text-blue-950 font-semibold gap-2 rounded-xl py-[30px] px-13! cursor-pointer shadow-[0_0_50px_0px_rgba(255,193,7,0.25)] hover:shadow-none  transition-all duration-300"
          >
            Shop Now
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 hover:text-white font-semibold bg-transparent rounded-xl py-7 px-13 cursor-pointer"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  )
}
