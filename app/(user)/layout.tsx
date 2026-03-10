import type React from "react"
import "../globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { UserProvider } from "../context/userContext"
import {Toaster} from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {/* GLOBAL HEADER */}
      <Header />

      {/* PAGE CONTENT */}
      <main className="grow bg-[#fffaf3]">
        {children}
      </main>
      <Toaster/>
      {/* GLOBAL FOOTER */}
      <Footer />
    </>
  )
}
