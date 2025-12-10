"use client"

import { useState } from "react"
import { Menu, X, Phone, ShoppingCart, User,BookOpen  } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-950 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold"><BookOpen /></span>
            </div>
            <div>
              <div className="font-bold text-lg text-blue-950 hidden sm:block">Globe Nest</div>
              <div className="text-xs text-gray-600 hidden sm:block">School Supplies</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <a href="#" className="text-gray-700 hover:text-blue-950 transition font-medium">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-950 transition font-medium">
              Browse Schools
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-950 transition font-medium">
              About Us
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-950 transition font-medium">
              Contact
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex gap-4 items-center">
            <div className="flex items-center gap-2 text-blue-950 text-sm">
              <Phone size={16} />
              <span>+91 98765 43210</span>
            </div>
            <ShoppingCart size={20} className="text-gray-700 cursor-pointer" />
            <User size={20} className="text-gray-700 cursor-pointer" />
            <Button className="bg-blue-950 hover:bg-blue-800 text-white rounded-lg px-6 cursor-pointer">Shop Now</Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Home
            </a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Browse Schools
            </a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              About Us
            </a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Contact
            </a>
            <div className="flex flex-col gap-2 px-4 pt-2">
              <Button className="w-full bg-blue-950 hover:bg-blue-800 text-white">Shop Now</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
