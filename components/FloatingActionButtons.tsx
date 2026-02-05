"use client"

import { RiWhatsappFill, RiMailFill, RiPhoneFill } from "@remixicon/react"
import Link from "next/link"

export default function FloatingActionButtons() {
  const whatsappNumber = "9391779949" 
  const email = "glownestserv@gmail.com" 
  const phone = "9391779949" 

  return (
    <div className="fixed right-3 bottom-6 sm:right-4 sm:bottom-8 md:right-6 md:bottom-10 z-50 flex flex-col gap-2 sm:gap-3">
       {/* WhatsApp  */}
      <Link
        href={`https://wa.me/${whatsappNumber}?text=Hello, I am interested in booking the order / Service  related queries. Please call me back.`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative"
      >
        <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-[#25D366]/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-105 hover:bg-[#25D366] cursor-pointer">
          <RiWhatsappFill className="text-white" size={16} />
        </div>
        <span className="hidden sm:block absolute right-12 md:right-14 top-1/2 -translate-y-1/2 bg-gray-800/90 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat on WhatsApp
        </span>
      </Link>

      {/* Contact/Phone */}
      <Link
        href={`tel:${phone}`}
        className="group relative"
      >
        <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-blue-500/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-105 hover:bg-blue-500 cursor-pointer">
          <RiPhoneFill className="text-white" size={16} />
        </div>
        <span className="hidden sm:block absolute right-12 md:right-14 top-1/2 -translate-y-1/2 bg-gray-800/90 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Call Us
        </span>
      </Link>

      {/* Email */}
      <Link
        href={`mailto:${email}`}
        className="group relative"
      >
        <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-105 hover:bg-red-500 cursor-pointer">
          <RiMailFill className="text-white" size={16} />
        </div>
        <span className="hidden sm:block absolute right-12 md:right-14 top-1/2 -translate-y-1/2 bg-gray-800/90 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Send Email
        </span>
      </Link>
    </div>
  )
}
