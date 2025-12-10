import Header from "@/components/header"
import Hero from "@/components/hero"
import PartnerSchools from "@/components/partner-schools"
import Features from "@/components/features"
import HowItWorks from "@/components/how-it-works"
import HeroCTA from "@/components/hero-cta"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <HowItWorks />
      <PartnerSchools />
      <Features />
      <HeroCTA />
      <Footer />
    </main>
  )
}
