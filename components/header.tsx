"use client"

import { useState } from "react"
import { Menu, X, Phone, ShoppingCart, User, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const NavLink = ({
    target,
    children,
    mobile = false,
    index = 0
  }: {
    target: string,
    children: React.ReactNode,
    mobile?: boolean,
    index?: number
  }) => (
    <button
      onClick={() => {
        handleScroll(target)
        setIsOpen(false)
      }}
      className={`text-gray-700 hover:text-blue-900 transition font-medium text-sm cursor-pointer 
        ${mobile
          ? `block w-full text-left px-4 py-2 rounded transition-all duration-500 
             ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`
          : ""
        }
      `}
      style={mobile ? { transitionDelay: `${index * 90}ms` } : {}}
    >
      {children}
    </button>
  )

  return (
    <header className="bg-white/95 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-950 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">
                <BookOpen />
              </span>
            </div>
            <div>
              <div className="font-bold text-lg text-blue-950">Globe Nest</div>
              <div className="text-xs text-gray-600">School Supplies</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-5 lg:gap-8">
            <NavLink target="home">Home</NavLink>
            <NavLink target="schools">Browse Schools</NavLink>
            <NavLink target="about">About Us</NavLink>
            <NavLink target="contact">Contact</NavLink>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <div className="lg:flex items-center gap-1.5 text-blue-950 text-sm hidden">
              <Phone size={16} />
              <span>+91 98765 43210</span>
            </div>

            <ShoppingCart size={20} className="text-gray-700 cursor-pointer" />
            <User size={20} className="text-gray-700 cursor-pointer" />

            <Button className="bg-blue-950 hover:bg-blue-800 text-white rounded-lg px-4 lg:px-6">
              Shop Now
            </Button>
          </div>

          {/* Mobile Icons */}
          <div className="flex gap-5 md:hidden">
            <ShoppingCart size={20} className="text-gray-700 cursor-pointer" />
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out 
            ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <div
            className={`transition-all duration-1000 ease-in-out transform 
              ${isOpen ? "translate-y-0" : "-translate-y-4"}`}>
            <div className="pb-4 space-y-2">

              {/* Animated Mobile NavLinks */}
              <NavLink target="home" mobile index={0}>Home</NavLink>
              <NavLink target="schools" mobile index={1}>Browse Schools</NavLink>
              <NavLink target="about" mobile index={2}>About Us</NavLink>
              <NavLink target="contact" mobile index={3}>Contact</NavLink>

              <a
                className={`block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-all duration-500 font-medium text-sm
                  ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}
                style={{ transitionDelay: `${4 * 90}ms` }}
              >
                My Account
              </a>

              <div
                className={`flex flex-col gap-2 px-4 pt-2 transition-all duration-500
                  ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}
                style={{ transitionDelay: `${5 * 90}ms` }}
              >
                <Button className="w-full bg-blue-950 hover:bg-blue-800 text-white">Shop Now</Button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </header>
  )
}
