import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen overflow-hidden bg-white dark:bg-gray-900">
            <div className="flex h-full">
                {/* Left Side - Image/Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-brand-950 dark:bg-white/5 items-center justify-center p-12">
                    <div className="flex items-center justify-center">
                        <Image
                            width={300}
                            height={300}
                            src="/login.png"
                            alt="Logo"
                            className="rounded-xl"
                        />
                    </div>
                </div>
                
                {/* Right Side - Auth Forms */}
                <div className="w-full lg:w-1/2 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}