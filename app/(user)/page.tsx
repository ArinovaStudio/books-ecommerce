"use client"

import Hero from "@/components/landing/hero"
import PartnerSchools from "@/components/landing/partner-schools"
import Features from "@/components/landing/features"
import HowItWorks from "@/components/landing/how-it-works"
import HeroCTA from "@/components/landing/hero-cta"
import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const section = document.getElementById(hash);
      section?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  return (
    <main>
      <Hero />
      <HowItWorks />
      <PartnerSchools />
      <Features />
      <HeroCTA />
    </main>
  )
}
