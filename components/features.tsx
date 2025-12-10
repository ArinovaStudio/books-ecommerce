import { Card } from "@/components/ui/card"
import { CheckCircle, DollarSign, Clock, Package, RotateCcw, Headphones } from "lucide-react"

const features = [
  {
    icon: CheckCircle,
    title: "100% Genuine Products",
    description: "All books are sourced directly from authorized publishers and distributors",
  },
  {
    icon: DollarSign,
    title: "Best Bundle Pricing",
    description: "Save up to 20% when you buy complete book sets and stationery kits",
  },
  {
    icon: Clock,
    title: "Quick Delivery",
    description: "Get your order delivered within 3-5 business days across India",
  },
  {
    icon: Package,
    title: "Secure Packaging",
    description: "Books are carefully packed to ensure they reach you in perfect condition",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Hassle-free return policy within 7 days of delivery",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Our customer support team is available to help you via phone and email",
  },
]

export default function Features() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-950">Why Parents Trust Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We understand the importance of getting the right materials for your child's education. Here's why thousands
            of parents choose us.
          </p>
        </div>

        {/* Features Grid - 2x3 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow border border-gray-200">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-blue-950" size={24} />
                </div>
                <h3 className="text-xl font-bold text-blue-950 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
