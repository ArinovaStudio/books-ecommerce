"use client";

import { Truck, FileText, ShieldCheck } from "lucide-react";

export default function PoliciesPage() {
  return (
    <section className="bg-[#faf7f2] py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* HERO HEADER */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 text-orange-600 px-4 py-1 text-sm font-medium">
            <ShieldCheck size={16} />
            Legal & Policies
          </span>

          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900">
              Policies & Legal
            </h1>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Transparent policies designed to give parents complete clarity and
              confidence
            </p>
          </div>
        </div>

        {/* TERMS & CONDITIONS CARD */}
        <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-yellow-100 text-yellow-600 rounded-2xl">
              <FileText size={24} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Terms & Conditions
            </h2>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed text-base">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Use of Website & Services
              </h3>
              <p>
                By accessing or placing an order on the Glow Nest Services
                website, you agree to comply with all applicable terms,
                policies, and guidelines published on the site.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Pricing & Availability
              </h3>
              <p>
                All prices, promotions, and product availability are subject to
                change without prior notice. Orders may be modified or cancelled
                if a product is unavailable or listed with an obvious error.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Payments</h3>
              <p>
                All orders must be paid in full using the payment methods
                displayed at checkout. An order is confirmed only after
                successful payment is received by Glow Nest Services.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                No Return Policy
              </h3>
              <p>
                Glow Nest Services follows a strict{" "}
                <strong>No Return Policy</strong>. Once an order is placed and
                delivered, it cannot be returned or exchanged unless required by
                applicable law or permitted under a separate written policy.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Limitation of Liability
              </h3>
              <p>
                Glow Nest Services shall not be liable for any indirect,
                incidental, or consequential damages arising from the use of our
                products or website. Any liability, if applicable, is limited to
                the amount actually paid for the specific order.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Changes to Terms
              </h3>
              <p>
                We reserve the right to update or modify these Terms &
                Conditions at any time. Continued use of the website or
                placement of orders after changes are posted will constitute
                acceptance of the revised terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
