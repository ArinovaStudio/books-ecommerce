import { Card } from "@/components/ui/card"
import { Building2, BookOpen, ShoppingCart, Truck } from "lucide-react"

const steps = [
  {
    number: 1,
    icon: Building2,
    title: "Select Your School",
    description: "Choose from our list of partnered schools across India",
  },
  {
    number: 2,
    icon: BookOpen,
    title: "Pick Class & Bundle",
    description: "Select the class and choose from book or stationery bundles",
  },
  {
    number: 3,
    icon: ShoppingCart,
    title: "Add to Cart",
    description: "Review your selection and add to cart with just one click",
  },
  {
    number: 4,
    icon: Truck,
    title: "Doorstep Delivery",
    description: "Get your order delivered right to your doorstep",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-32 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-950 text-balance">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Getting your child's school supplies has never been easier. Just follow these simple steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative px-0">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-12 left-10 right-0 h-1 bg-linear-to-r bg-gray-100 -z-10 "></div>

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                {/* Step Number Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 md:w-12 md:h-12 bg-amber-500 text-black rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {step.number}
                </div>

                {/* Card */}
                <Card className="py-8 px-4 h-full border border-gray-200 hover:shadow-lg transition-shadow flex flex-col items-start text-left gap-3">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="text-blue-950" size={32} />
                  </div>

                  <h3 className="text-xl font-bold text-blue-950 mt-3">{step.title}</h3>

                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </Card>

              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
