import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, ArrowRight } from "lucide-react"

const schools = [
  { name: "Delhi Public School", location: "New Delhi", icon: "🏫" },
  { name: "St. Mary's Convent School", location: "Mumbai", icon: "🏫" },
  { name: "The Heritage School", location: "Bangalore", icon: "🏫" },
  { name: "Ryan International School", location: "Gurugram", icon: "🏫" },
  { name: "Kendriya Vidyalaya", location: "Chennai", icon: "🏫" },
]

export default function PartnerSchools() {
  return (
    <section className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex justify-between items-start mb-16">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 text-balance">Partner Schools</h2>
            <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
              We work with top schools across India to bring you the exact books and supplies your child needs.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-2 border-blue-900 text-blue-950 hover:bg-blue-950 hover:text-white rounded-lg px-6 hidden md:flex gap-2 bg-transparent cursor-pointer"
          >
            View All Schools
            <ArrowRight size={18} />
          </Button>
        </div>

        {/* Schools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {schools.map((school, index) => (
            <Card
              key={index}
              className="px-6 py-4 hover:shadow-lg transition-shadow cursor-pointer text-left flex flex-col items-start gap-3"
            >
              <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-3xl">{school.icon}</span>
              </div>
              <h3 className="font-bold text-sm text-blue-950 mt-2">{school.name}</h3>
              <div className="flex items-center gap-1 text-gray-600 mt-auto">
                <MapPin size={16} />
                <span className="text-sm">{school.location}</span>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}
