import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, ShieldCheck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(135deg,#141f38_0%,#22345e_50%,#1f5c7a_100%)] text-white">
      {/* Subtle background glow to match Hero */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6 pb-12">

          {/* Column 1: Brand & Social */}
          <div className="col-span-2 lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-1.5 rounded-xl border border-white/10">
                <Image src="/logo .png" alt="Glow Nest Logo" width={45} height={45} className="object-contain" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Glow Nest</h2>
            </div>
            <p className="text-blue-100/70 text-sm leading-relaxed max-w-sm">
              Simplifying school shopping. Get official book sets and stationery kits delivered directly to your doorstep with total accuracy.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4 text-blue-100/80 text-sm">
              <li><Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
              <li><Link href="/schools" className="hover:text-cyan-400 transition-colors">Browse Schools</Link></li>
              <li><Link href="/about" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
              <li><Link href="/profile" className="hover:text-cyan-400 transition-colors">My Profile</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-white">Legal & Support</h3>
            <ul className="space-y-4 text-blue-100/80 text-sm">
              <li><Link href="/policy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-cyan-400 transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-white">Contact Us</h3>
            <ul className="space-y-4 text-blue-100/80 text-sm">
              <li className="flex gap-3">
                <MapPin className="text-cyan-400 shrink-0" size={18} />
                <span>123 Education Lane, Sector 5, New Delhi - 110001</span>
              </li>
              <li className="flex gap-3">
                <Phone className="text-cyan-400 shrink-0" size={18} />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex gap-3">
                <Mail className="text-cyan-400 shrink-0" size={18} />
                <span>support@globenest.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* SECURITY NOTICE - Updated with Cyan border */}
        <div className="mb-8">
          <div className="flex items-start gap-4 bg-white/5 border border-cyan-400/20 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
            <ShieldCheck className="text-cyan-400 shrink-0 hidden sm:block" size={24} />
            <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
              <strong className="text-white">Security Notice:</strong> Beware of scammers—we never request OTPs, bank
              details, or card information. All legitimate communications
              occur through official channels. Report any suspicious requests immediately.
            </p>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10 text-blue-100/50 text-xs sm:text-sm text-center sm:text-left">
          <p>© {currentYear} Glow Nest. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="text-white font-medium">Arinova Studio</span>
          </div>
        </div>

      </div>
    </footer>
  )
}