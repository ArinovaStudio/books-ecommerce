"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  ShoppingCart,
  User,
  BookOpen,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header({ classname }: { classname?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Pages where search + compact header should show
  const isSchoolPage =
    pathname.startsWith("/schools") ||
    pathname.startsWith("/classes") ||
    pathname.startsWith("/products");

  const isLanding = pathname === "/";

  const handleNavigation = (target: string) => {
    if (isLanding) {
      const section = document.getElementById(target);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#${target}`);
    }
    setIsOpen(false);
  };

  const NavLink = ({
    target,
    children,
    mobile = false,
    index = 0,
  }: {
    target: string;
    children: React.ReactNode;
    mobile?: boolean;
    index?: number;
  }) => (
    <button
      onClick={() => handleNavigation(target)}
      className={`text-gray-700 hover:text-blue-900 transition font-medium text-sm cursor-pointer 
        ${mobile
          ? `block w-full text-left px-4 py-2 rounded transition-all duration-500 
             ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`
          : ""}`}
      style={mobile ? { transitionDelay: `${index * 90}ms` } : {}}
    >
      {children}
    </button>
  );

  return (
    <header className={`${classname} bg-white/95 sticky top-0 z-50  backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1">

        {/* TOP HEADER BAR */}
        <div className="flex justify-between items-center h-16 w-full">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-950 rounded-lg flex items-center justify-center">
              <BookOpen className="text-white" />
            </div>
            <div className="">
              <div className="font-bold text-lg text-blue-950">Globe Nest</div>
              <div className="text-xs text-gray-600">School Supplies</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!isSchoolPage && (
            <nav className="hidden md:flex gap-5 lg:gap-8">
              <NavLink target="home">Home</NavLink>
              <NavLink target="schools">Browse Schools</NavLink>
              <NavLink target="about">About Us</NavLink>
              <NavLink target="contact">Contact</NavLink>
            </nav>
          )}

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-10">

            {/* Search bar only on school pages */}
            {isSchoolPage && (
              <div className="flex items-center bg-gray-100 rounded-lg p-3 min-w-md">
                <Search size={18} className="text-gray-600" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none px-2 text-sm w-full"
                />
              </div>
            )}

            {!isSchoolPage && (
              <div className="lg:flex items-center gap-1.5 text-blue-950 text-sm hidden">
                <Phone size={16} />
                <span>+91 98765 43210</span>
              </div>
            )}

            <ShoppingCart size={20} className="text-gray-700 cursor-pointer" />
            <User size={20} className="text-gray-700 cursor-pointer" />

            {!isSchoolPage && (
              <Button className="bg-blue-950 hover:bg-blue-800 text-white rounded-lg px-4 lg:px-6">
                Shop Now
              </Button>
            )}
          </div>

          {/* MOBILE ICONS */}
          {isSchoolPage ? (
            /* School Pages → No hamburger menu, just logo + cart + profile */
            <div className="flex items-center gap-4 md:hidden ml-auto">
              <ShoppingCart size={20} className="text-gray-700 cursor-pointer" />
              <User size={20} className="text-gray-700 cursor-pointer" />
            </div>
          ) : (
            /* Landing Page → Show Hamburger */
            <div className="flex gap-5 md:hidden">
              <ShoppingCart size={20} className="text-gray-700 cursor-pointer" />
              <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>

        {/* MOBILE SEARCH (school pages only) */}
        {isSchoolPage && (
          <div className="md:hidden  mt-3">
            <div className="flex flex-col w-full bg-gray-100 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <Search size={18} className="text-gray-600" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* MOBILE MENU (hidden for school pages) */}
        {!isSchoolPage && (
          <div
            className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out 
              ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div
              className={`transition-all duration-700 ease-in-out transform 
                ${isOpen ? "translate-y-0" : "-translate-y-4"}`}
            >
              <div className="pb-4 space-y-2">

                {/* Animated Mobile NavLinks */}
                <NavLink target="home" mobile index={0}>Home</NavLink>

                <NavLink target="schools" mobile index={1}>Browse Schools
                </NavLink>

                <NavLink target="about" mobile index={2}>About Us</NavLink>
                <NavLink target="contact" mobile index={3}>Contact</NavLink>

                <div
                  className={`flex flex-col gap-2 px-4 pt-2 transition-all duration-500
                    ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}
                >
                  <Button className="w-full bg-blue-950 hover:bg-blue-800 text-white">
                    Shop Now
                  </Button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
