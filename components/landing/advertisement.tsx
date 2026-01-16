"use client";
import Marquee from "react-fast-marquee"
export default function Advartisement() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 border-t border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">
            Trusted Schools
          </p>
        </div>

        <div className="relative">
          <Marquee className="overflow-visible! flex w-full space-x-8 sm:space-x-16">
            <div className="flex items-center space-x-4 flex-shrink-0">
              {[
                "All kinds of Sports Items to schools",
                "All kinds of Stationery",
                "All kinds of Computer Lab Setup @ School",
                "Assistances in CBSE School Library Setup",
                "School Belts"
              ].map((item, i) => (
                <span
                  key={i}
                  className="px-5 py-2 rounded-full text-sm sm:text-base font-medium whitespace-nowrap border border-border bg-background/70 text-muted-foreground backdrop-blur shadow-sm hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-all duration-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </Marquee>
        </div>
      </div>
    </section>
  );
}
