import type React from "react"
import "../globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={"min-h-screen flex flex-col"}>

        {/* GLOBAL HEADER */}
        <Header />

        {/* PAGE CONTENT */}
        <main className="grow bg-[#fffaf3] ">
          {children}
        </main>

        {/* GLOBAL FOOTER */}
        <Footer />

      </body>
    </html>
  )
}
