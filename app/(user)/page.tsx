"use client"

import Hero from "@/components/landing/hero"
import PartnerSchools from "@/components/landing/partner-schools"
import Features from "@/components/landing/features"
import HowItWorks from "@/components/landing/how-it-works"
import HeroCTA from "@/components/landing/hero-cta"
import { useEffect } from "react"
import AboutUs from "@/components/landing/about-us"
import Companies from "@/components/landing/companies"
import Courses from "@/components/landing/courses"
import Learning from "@/components/landing/learning-path"
import Cta from "@/components/landing/cta"
import Testimonial from "@/components/landing/testimonial"
import Event from "@/components/landing/event"

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
      {/* <AboutUs/> */}
      <PartnerSchools />
      <Courses/>
      <Learning/>
      {/* <Cta/> */}
      <Companies/>
      <Testimonial/>
      
      {/* 
      <HowItWorks />
      <Features />
      
      <HeroCTA />
      <Event/>
      */}
    </main>
  )
}
