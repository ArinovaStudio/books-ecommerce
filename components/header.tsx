"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone, ShoppingCart, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

type User = {
  id: string
  name: string
  email: string
  role: string
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

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
        className="text-white hover:text-orange-400 font-medium text-sm transition cursor-pointer"
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="bg-[#0c2f25]/95 backdrop-blur-sm sticky top-0 z-70 shadow-sm border-b border-orange-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 sm:py-1">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link href="/" scroll={false}>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="rounded-lg flex items-center justify-center ">
                {/* <BookOpen className="text-white" /> */}
                <Image src="/logo .png" alt="GlobeNest Logo"
                  width={80}
                  height={80}
                  className="object-contain " />
              </div>
              <div>
                <div className="font-bold text-lg text-orange-400">
                  Glow Nest
                </div>
                <div className="text-xs text-white">
                  School Supplies
                </div>
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex gap-5">
            <NavLink target="home" label="Home" />
            <Link href="/about" className="text-white font-medium text-sm" scroll={false}>About us</Link>
            <Link href="/schools" className="text-white font-medium text-sm" scroll={false}>Browse Schools</Link>
          </nav>

          {/* DESKTOP CTA */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-1 text-white text-sm">
              <Phone size={16} />
              <span>+91 98765 43210</span>
            </div>

            <ShoppingCart
              size={20}
              className="text-white hover:text-orange-600 cursor-pointer transition"
            />
            {user ? (
              <Link href="/profile">
                <User
                  size={20}
                  className="text-white hover:text-orange-600 cursor-pointer transition"
                />
              </Link>
            ) : null}

            {!user && (
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-lg cursor-pointer"
                onClick={() => router.push("/signin")}
              >
                Login
              </Button>
            )}
          </div>

          {/* TABLET ICONS */}
          <div className="hidden md:flex lg:hidden items-center gap-4">
            <ShoppingCart
              size={22}
              className="text-white hover:text-orange-600 cursor-pointer transition"
            />
            {user ? (
              <User
                size={22}
                className="text-white hover:text-orange-600 cursor-pointer transition"
              />
            ) : null}

            {/* <Button
              className="px-4 py-1.5 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg cursor-pointer"
              onClick={() => router.push("/schools")}
            >
              Shop Now
            </Button> */}

            <button
              className="p-1 rounded hover:bg-orange-400/20"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* MOBILE ICONS */}
          <div className="flex md:hidden items-center gap-4">
            <ShoppingCart
              size={22}
              className="text-white hover:text-orange-600 cursor-pointer transition"
            />

            <button
              className="p-1 rounded hover:bg-orange-400/20 text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        <div
          className={`md:hidden transition-all overflow-hidden ${isOpen ? "max-h-96" : "max-h-0"
            }`}
        >
          <div className="pb-4 space-y-2 px-2">
            {["home", "schools", "about", "contact"].map((item) => (
              <button
                key={item}
                onClick={() => handleScroll(item)}
                className="block w-full text-left px-4 py-2 text-white hover:bg-orange-400/20 rounded"
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
