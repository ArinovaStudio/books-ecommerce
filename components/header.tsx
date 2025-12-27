"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone, ShoppingCart, User, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

type UserType = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        const data = await response.json();
        if (data.success) setUser(data.user);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleNavClick = (target: string, isExternal: boolean = false) => {
    setIsOpen(false);
    if (isExternal) {
      router.push(target);
    } else {
      const section = document.getElementById(target);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(`/#${target}`);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[linear-gradient(135deg,#141f38_0%,#22345e_50%,#1f5c7a_100%)] backdrop-blur-md shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-20">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
              <Image
                src="/logo .png"
                alt="Glow Nest Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl text-white leading-tight tracking-tight">Glow Nest</span>
              <span className="text-[10px] sm:text-xs text-cyan-400 uppercase tracking-widest font-semibold">School Supplies</span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={() => handleNavClick("home")} className="text-white/80 hover:text-cyan-400 cursor-pointer font-medium text-sm transition-colors">Home</button>
            <Link href="/about" className="text-white/80 hover:text-cyan-400 font-medium text-sm transition-colors">About Us</Link>
            <Link href="/schools" className="text-white/80 hover:text-cyan-400 font-medium text-sm transition-colors">Browse Schools</Link>
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 text-white/70 text-sm border-r border-white/10 pr-6">
              <Phone size={14} className="text-cyan-400" />
              <span>+91 98765 43210</span>
            </div>

            <div className="flex items-center gap-5">
              {!loading && (
                user ? (
                  <Link href={user.role === "ADMIN" ? "/admin" : "/profile"} className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-cyan-400 hover:text-[#141f38] transition-all" title="Profile">
                    <User size={20} />
                  </Link>
                ) : (
                  <Button
                    className="bg-cyan-400 hover:bg-cyan-300 cursor-pointer text-[#141f38] font-bold rounded-full px-6 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                    onClick={() => router.push("/signin")}
                  >
                    Sign In
                  </Button>
                )
              )}
            </div>
          </div>

          {/* MOBILE TOGGLE & CART */}
          <div className="flex lg:hidden items-center gap-4">
            <button
              className="p-2 rounded-xl bg-white/5 text-white border border-white/10 transition-all active:scale-95"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* MOBILE OVERLAY MENU */}
        <div
          className={`lg:hidden fixed inset-x-0 top-[80px] bg-[#141f38] border-b border-white/10 shadow-2xl transition-all duration-300 ease-in-out z-40 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
        >
          <div className="p-6 space-y-2 flex flex-col">
            <button onClick={() => handleNavClick("home")} className="text-left py-4 text-lg font-medium text-white border-b border-white/5 hover:text-cyan-400 transition-colors">Home</button>
            <button onClick={() => handleNavClick("/about", true)} className="text-left py-4 text-lg font-medium text-white border-b border-white/5 hover:text-cyan-400 transition-colors">About Us</button>
            <button onClick={() => handleNavClick("/schools", true)} className="text-left py-4 text-lg font-medium text-white border-b border-white/5 hover:text-cyan-400 transition-colors">Browse Schools</button>

            {!loading && (
              user ? (
                <button onClick={() => handleNavClick("/profile", true)} className="text-left py-4 text-lg font-medium text-cyan-400 flex items-center gap-3">
                  <User size={22} /> My Profile
                </button>
              ) : (
                <button onClick={() => handleNavClick("/signin", true)} className="mt-4 py-4 rounded-xl bg-cyan-400 text-[#141f38] font-bold flex items-center justify-center gap-2 shadow-lg">
                  <LogIn size={20} /> Sign In
                </button>
              )
            )}

            <div className="mt-6 py-4 flex items-center justify-center gap-3 text-white/40 text-xs tracking-wider uppercase">
              <Phone size={14} />
              <span>Support: +91 98765 43210</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}