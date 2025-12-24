import Image from "next/image";
import React from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen overflow-hidden bg-white">
            <div className="flex h-full m-5">
                <div className="">
                    <div className="rounded-lg flex items-center justify-center ">
                        {/* <BookOpen className="text-white" /> */}
                        <Image src="/logo .png" alt="GlobeNest Logo"
                            width={80}
                            height={80}
                            className="object-contain "
                        />
                    </div>
                </div>
                {/* Left Side - Image/Branding */}
                <div className="hidden no-scrollbar lg:flex lg:w-1/2 bg-brand-950 flex-col items-center justify-center p-12">
                    <div className="flex items-center justify-center">
                        <Image
                            width={300}
                            height={300}
                            src="/login.png"
                            alt="Logo"
                            className="rounded-xl"
                        />
                    </div>
                    <div>
                        <p className="text-center text-gray-900 mt-6 text-lg font-medium">
                            Building better learning spaces together.
                        </p>
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