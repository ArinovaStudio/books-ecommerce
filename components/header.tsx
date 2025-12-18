"use client";

import { useState } from "react";
import { Menu, X, Phone, ShoppingCart, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const NavLink = ({
    target,
    label,
  }: {
    target: string;
    label: string;
  }) => {
    const onClick = () => {
      if (window.location.pathname === "/") {
        handleScroll(target);
      }
    };

    return (
      <Link
        href={`/#${target}`}
        scroll={false}
        onClick={onClick}
        className="text-gray-700 hover:text-amber-700 font-medium text-sm transition cursor-pointer"
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="bg-white sticky top-0 z-70 shadow-sm border-b border-amber-400/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link href="/" scroll={false}>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <BookOpen className="text-white" />
              </div>
              <div>
                <div className="font-bold text-lg text-amber-700">
                  Globe Nest
                </div>
                <div className="text-xs text-gray-600">
                  School Supplies
                </div>
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex gap-5">
            <NavLink target="home" label="Home" />
            <NavLink target="schools" label="Browse Schools" />
            <NavLink target="about" label="About Us" />
            <NavLink target="contact" label="Contact" />
          </nav>

          {/* DESKTOP CTA */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-1 text-amber-700 text-sm">
              <Phone size={16} />
              <span>+91 98765 43210</span>
            </div>

            <ShoppingCart
              size={20}
              className="text-gray-700 hover:text-amber-600 cursor-pointer transition"
            />
            <User
              size={20}
              className="text-gray-700 hover:text-amber-600 cursor-pointer transition"
            />

            <Button
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 rounded-lg cursor-pointer"
              onClick={() => router.push("/schools")}
            >
              Shop Now
            </Button>
          </div>

          {/* TABLET ICONS */}
          <div className="hidden md:flex lg:hidden items-center gap-4">
            <ShoppingCart
              size={22}
              className="text-gray-700 hover:text-amber-600 cursor-pointer transition"
            />
            <User
              size={22}
              className="text-gray-700 hover:text-amber-600 cursor-pointer transition"
            />

            <Button
              className="px-4 py-1.5 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-lg cursor-pointer"
              onClick={() => router.push("/schools")}
            >
              Shop Now
            </Button>

            <button
              className="p-1 rounded hover:bg-amber-400/20"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* MOBILE ICONS */}
          <div className="flex md:hidden items-center gap-4">
            <ShoppingCart
              size={22}
              className="text-gray-700 hover:text-amber-600 cursor-pointer transition"
            />

            <button
              className="p-1 rounded hover:bg-amber-400/20"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        <div
          className={`md:hidden transition-all overflow-hidden ${
            isOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="pb-4 space-y-2 px-2">
            {["home", "schools", "about", "contact"].map((item) => (
              <button
                key={item}
                onClick={() => handleScroll(item)}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-400/20 rounded"
              >
                {item === "schools"
                  ? "Browse Schools"
                  : item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
