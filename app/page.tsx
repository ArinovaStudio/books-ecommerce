import Header from "@/components/header"
import Hero from "@/components/landing/hero"
import PartnerSchools from "@/components/landing/partner-schools"
import Features from "@/components/landing/features"
import HowItWorks from "@/components/landing/how-it-works"
import HeroCTA from "@/components/landing/hero-cta"
import Footer from "@/components/landing/footer"

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
