import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, BookOpen, MessageSquare, Download } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-linear-to-br from-green-950 via-green-900 to-green-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/*  BRAND + FEATURES */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 py-10 border-b border-white/10">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image src="/logo .png" alt="Glow Nest Logo" width={80} height={80} />
            <h2 className="text-xl sm:text-2xl font-bold">Glow Nest</h2>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-blue-100">

            <div className="flex items-start gap-3">
              <MapPin className="text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">Find a Shop</p>
                <p className="text-sm">Locate us nearby</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageSquare className="text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">Offer Insights</p>
                <p className="text-sm">Speak your thoughts</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Download className="text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">Get Our App</p>
                <p className="text-sm">Download from App Stores</p>
              </div>
            </div>

          </div>
        </div>

        {/* TOP LINKS */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 sm:gap-8 py-10 sm:pl-7 border-b border-white/10 text-blue-100 text-sm">

          <div className="space-y-2">
            <p>Home</p>
            <p>Browse Schools</p>
            <p>About Us</p>
            <p>Profile</p>
          </div>

          <div className="space-y-2">
            <Link href={'/policy'} className="text-blue-100 text-sm cursor-pointer ">
              <p className="pb-2">Privacy Policy</p>

            </Link>
            <Link href={'/policy'} className="text-blue-100 text-sm cursor-pointer">
              <p className="pb-2">Terms of Service</p>

            </Link>
            <Link href={'/policy'} className="text-blue-100 text-sm cursor-pointer">
              <p className="pb-2">Refund Policy</p>

            </Link>
            <Link href={'/policy'} className="text-blue-100 text-sm cursor-pointer">
              <p className="pb-2">Shipping Policy</p>

            </Link>
          </div>



          <div className="space-y-2 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <Linkedin size={16} />
              <p>LinkedIn</p>
            </div>

            <div className="flex items-center gap-2">
              <Instagram size={16} />
              <p>Instagram</p>
            </div>

            <div className="flex items-center gap-2">
              <Facebook size={16} />
              <p>Facebook</p>
            </div>
            <div className="flex items-center gap-2">
              <Twitter size={16} />
              <p>Twitter</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-white font-medium">Contact Us</p>
            <p>123 Education Lane, Sector 5, New Delhi - 110001</p>
            <p>+91 98765 43210</p>
            <p>support@globenest.in</p>
          </div>
        </div>

        {/* SECURITY NOTICE */}
        <div className="my-8">
          <p className="text-xs sm:text-sm text-white bg-lime-400/20 border border-lime-400 rounded-lg px-4 sm:px-5 py-4 leading-relaxed">
            <strong>Security Notice:</strong> Beware of scammers—we never request OTPs, bank
            details, or card information from our customers. All legitimate communications
            occur through official channels listed on this platform. Report any suspicious
            requests immediately to protect your information.
          </p>
        </div>

        {/*  BOTTOM LEGAL BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/10 text-blue-100 text-xs sm:text-sm text-center md:text-left">

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <a href="#" className="hover:text-amber-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition">Terms of Use</a>
          </div>

          <p className="opacity-70">Design by Arinova Studio</p>

          <p className="opacity-70">© Glow Nest. All rights reserved.</p>
        </div>

      </div>
    </footer>
  )
}
