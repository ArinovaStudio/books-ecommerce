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

        {/* SHIPPING POLICY CARD */}
        <div className="bg-white rounded-3xl border border-gray-200 p-10 mb-14 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl">
              <Truck size={24} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Shipping Policy
            </h2>
          </div>

          <ul className="space-y-5 text-gray-700 leading-relaxed text-base">
            <li>
              Glow Nest Services ships all orders within{" "}
              <strong>4–5 business days</strong> after order confirmation using
              trusted courier partners across India.
            </li>
            <li>
              Delivery usually takes <strong>5–7 business days</strong> from
              dispatch, depending on your city and courier connectivity.
            </li>
            <li>
              Shipping charges are clearly displayed at checkout before
              completing payment.
            </li>
            <li>
              You will receive a tracking link or information via{" "}
              <strong>SMS, WhatsApp, or email</strong> once your order is
              dispatched, so you can track your shipment online.
            </li>
            <li>
              Delays caused by courier operations, weather, strikes, or
              government/local restrictions are outside our direct control, but
              Glow Nest Services will assist you in coordinating with the
              courier if issues arise.
            </li>
            <li>
              If a shipment is undeliverable and returned to us, we will contact
              you to arrange reshipment or, in case of issues, refund you
              according to your order amount.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
