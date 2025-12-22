import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, BookOpen } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#15203b] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-blue-950 font-bold">
                  <BookOpen />
                </span>
              </div>
              <div>
                <div className="font-bold">GlobeNest</div>
                <div className="text-xs text-blue-100">School Supplies</div>
              </div>
            </div>
            <p className="text-blue-100 leading-relaxed">
              Your trusted partner for school books and stationery. Making education accessible, one bundle at a time.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              <a href="#" aria-label="Facebook" className="hover:text-amber-500 transition">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-amber-500 transition">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-amber-500 transition">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2 text-blue-100">
              <li>
                <a href="#" className="hover:text-amber-500 transition">
                  Browse Schools
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Policies</h4>
            <ul className="space-y-2 text-blue-100">
              <li>
                <a href="#" className="hover:text-amber-500 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition">
                  Shipping Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact Us</h4>
            <ul className="space-y-3 text-blue-100">
              <li className="flex items-center gap-3 hover:text-amber-500 transition cursor-pointer">
                <MapPin size={18} />
                <span>123 Education Lane, Sector 5, New Delhi - 110001</span>
              </li>
              <li className="flex items-center gap-3 hover:text-amber-500 transition cursor-pointer">
                <Phone size={18} />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 hover:text-amber-500 transition cursor-pointer">
                <Mail size={18} />
                <span>support@globenest.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-sm text-blue-200 bg-blue-900/40 border border-blue-800 rounded-lg px-4 py-3 mb-8">
          <strong>Security Notice:</strong> Beware of scammers—we never request OTPs, bank details, or card information from our customers. All legitimate communications occur through official channels listed on this platform. Report any suspicious requests immediately to protect your information.
        </p>

        {/* Divider */}
        <div className="border-t border-blue-800 pt-8">
          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-blue-100 text-sm">
              © 2025 GlobeNest Services. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-blue-100">
              <a href="#" className="hover:text-amber-500 transition">
                Security
              </a>
              <a href="#" className="hover:text-amber-500 transition">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
