import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ShieldCheck,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(135deg,#141f38_0%,#22345e_50%,#1f5c7a_100%)] text-white">
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* MAIN GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6 pb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-1.5 rounded-xl border border-white/10">
                <Image
                  src="/logo.png"
                  alt="Glow Nest Logo"
                  width={45}
                  height={45}
                />
              </div>
              <h2 className="text-2xl font-bold">Glow Nest</h2>
            </div>
            <p className="text-blue-100/70 text-sm max-w-sm">
              Simplifying school shopping. Get official book sets and stationery
              kits delivered directly to your doorstep with total accuracy.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm text-blue-100/80">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/schools">Browse Schools</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/profile">My Profile</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Legal & Support</h3>
            <ul className="space-y-4 text-sm text-blue-100/80">
              <li><Link href="/policy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/contact">Help Center</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm text-blue-100/80">
              <li className="flex gap-3">
                <MapPin size={18} className="text-cyan-400" />
                123 Education Lane, New Delhi
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-cyan-400" />
                +91 98765 43210
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-cyan-400" />
                support@globenest.in
              </li>
            </ul>
          </div>
        </div>

        {/* SECURITY NOTICE */}
        <div className="mb-10">
          <div className="flex gap-4 bg-white/5 border border-cyan-400/20 rounded-2xl p-6">
            <ShieldCheck className="text-cyan-400 hidden sm:block" size={24} />
            <p className="text-sm text-blue-100/80">
              <strong className="text-white">Security Notice:</strong> We never
              ask for OTPs, card details, or bank info. Report suspicious
              activity immediately.
            </p>
          </div>
        </div>

        {/* SOCIAL + CONTACT */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-10 border-y border-white/10 text-sm text-blue-100">
          <div className="space-y-2">
            <p>Home</p>
            <p>Browse Schools</p>
            <p>About Us</p>
            <p>Profile</p>
          </div>

          <div className="space-y-2">
            <Link href="/policy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/shipping-policy">Shipping Policy</Link>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2"><Linkedin size={16} />LinkedIn</div>
            <div className="flex gap-2"><Instagram size={16} />Instagram</div>
            <div className="flex gap-2"><Facebook size={16} />Facebook</div>
            <div className="flex gap-2"><Twitter size={16} />Twitter</div>
          </div>

          <div className="space-y-2">
            <p className="text-white font-medium">Contact</p>
            <p>New Delhi</p>
            <p>+91 98765 43210</p>
            <p>support@globenest.in</p>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-blue-100/50">
          <p>© {currentYear} Glow Nest. All rights reserved.</p>
          <p>
            Powered by <span className="text-white">Arinova Studio</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
