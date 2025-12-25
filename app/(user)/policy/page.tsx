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
                            Transparent policies designed to give parents complete clarity and confidence
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
                            Orders are shipped within <strong>4–5 business days</strong> after confirmation using trusted courier partners across India.
                        </li>
                        <li>
                            Delivery usually takes <strong>5–7 business days</strong> from dispatch, depending on location and courier connectivity.
                        </li>
                        <li>
                            Shipping charges are transparently displayed at checkout before payment.
                        </li>
                        <li>
                            Tracking details are shared via <strong>SMS, WhatsApp, or email</strong> once the order is dispatched.
                        </li>
                        <li>
                            Delays due to courier operations, weather conditions, strikes, or government restrictions are outside our control,
                            but our team will assist in coordination.
                        </li>
                        <li>
                            If a shipment is returned as undeliverable, we will contact you to arrange reshipment or issue a refund
                            based on your order value.
                        </li>
                    </ul>
                </div>

                {/* TERMS & CONDITIONS CARD */}
                <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl">
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
                                By accessing or placing an order on Glow Nest Services, you agree to comply with
                                all policies, guidelines, and terms published on our website.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                                Pricing & Availability
                            </h3>
                            <p>
                                Prices, offers, and availability may change without prior notice.
                                Orders may be cancelled or corrected in case of errors or stock unavailability.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                                Payments
                            </h3>
                            <p>
                                Orders must be paid in full using the payment methods shown at checkout.
                                Confirmation occurs only after successful payment.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                                No Return Policy
                            </h3>
                            <p>
                                Glow Nest Services follows a strict <strong>No Return Policy</strong>.
                                Delivered orders cannot be returned or exchanged unless required by law.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                                Limitation of Liability
                            </h3>
                            <p>
                                Glow Nest Services is not liable for indirect or consequential losses.
                                Any liability is limited to the amount paid for the specific order.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                                Changes to Terms
                            </h3>
                            <p>
                                These terms may be updated at any time.
                                Continued use of the website after updates implies acceptance of the revised terms.
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
