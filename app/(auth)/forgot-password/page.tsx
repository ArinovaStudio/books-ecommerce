"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSchoolHelper } from "@/hooks/useSchoolHelper";
import useGoBack from "@/hooks/useGoBack";
import { Toaster } from "@/components/ui/sonner";
interface FormErrors {
    [key: string]: string;
}

const page = () => {
    const [formData, setFormData] = useState({
        email: "",
        otp: "",
        newPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [Otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const { clearSchool } = useSchoolHelper();
    const router = useRouter();
    const { toast } = useToast();
    const goBack = useGoBack();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otpSent) {
            await handleResetPassword(e);
        } else {
            await handleSendOtp(e);
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email.trim()) {
            setErrors({ email: "Email is required" });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await response.json();
            if (response.ok) {
                setOtp(data.otp);
                setOtpSent(true);
                setOtpVerified(true);
                toast({ title: "OTP Sent", description: data.message, variant: "default" });
            } else {
                toast({ title: "Error", description: data.message || "Failed to send OTP", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "An error occurred while sending OTP", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.otp.trim()) {
            setErrors({ otp: "OTP is required" });
            return;
        }
        if (!formData.newPassword.trim()) {
            setErrors({ newPassword: "New password is required" });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, password: formData.newPassword }),
            });
            const data = await response.json();
            if (response.ok) {
                toast({ title: "Password Reset", description: data.message, variant: "default" });
                router.push("/signin");
            } else {
                toast({ title: "Error", description: data.message || "Failed to reset password", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "An error occurred while resetting password", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.otp) {
            setErrors({ otp: "OTP is required" });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, otp: formData.otp }),
            });
            const data = await response.json();
            if (response.ok) {
                setDisabled(true);
                setOtpVerified(false);
                toast({ title: "OTP Verified", description: "OTP has been verified successfully", variant: "default" });
            } else {
                setErrors({ otp: "Invalid OTP" });
                toast({ title: "Error", description: "Invalid OTP entered", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "An error occurred while sending OTP", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value.replace(/\s/g, ""),
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleChangees = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value.replace(/\s/g, ""), }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };


    return (
        <div>
            <Toaster />
            <Button className="text-center bg-blue-600 hover:bg-blue-700 absolute left-0" size="icon" onClick={goBack}><ArrowLeft /></Button>
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50/50 p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl sm:shadow-none sm:bg-transparent p-6 sm:p-0">
                    <div className="mb-8 text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                            Forgot Password
                        </h1>
                        <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                            Enter the email address associated with your account, and we'll help you get back in.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="email"
                                className="text-sm font-semibold text-gray-700 ml-1"
                            >
                                Email Address
                            </Label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors h-5 w-5" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    disabled={disabled}
                                    value={formData.email.toLowerCase()}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    className={`pl-11 h-12 rounded-xl border-gray-200 bg-gray-50/30 focus:bg-white transition-all ${errors.email
                                        ? "border-red-500 ring-red-100"
                                        : "focus:ring-blue-100"
                                        }`}
                                />
                                {!errors.email && formData.email && (
                                    <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    </div>
                                )}
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>
                            )}
                        </div>
                        <div className="flex items-center justify-between p-x-8">
                            <div></div>
                            <div className="-mt-5">
                                <button onClick={handleSendOtp} className={`text-gray-600 cursor-pointer text-sm ${!otpSent ? "hidden" : ""}`}>resend otp</button>
                            </div>
                        </div>

                        {/* OTP */}
                        <div>
                            <Label
                                htmlFor="otp"
                                className="text-sm font-semibold text-gray-700 ml-1"
                            >
                                Otp
                            </Label>
                            <div className="flex items-center  gap-5">
                                <div className="space-y-1.5">
                                    <div className="relative group">
                                        <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors h-5 w-5" />
                                        <Input
                                            id="otp"
                                            name="otp"
                                            type="text"
                                            disabled={disabled}
                                            value={formData.otp}
                                            onChange={handleChange}
                                            placeholder="••••••"
                                            className={`pl-11 pr-11 h-12 rounded-xl border-gray-200 bg-gray-50/30 focus:bg-white transition-all ${errors.otp
                                                ? "border-red-500 ring-red-100"
                                                : "focus:ring-blue-100"
                                                }`}
                                        />
                                    </div>
                                    {errors.otp && (
                                        <p className="text-xs text-red-500 mt-1 ml-1">
                                            {errors.otp}
                                        </p>
                                    )}
                                </div>
                                <div><button disabled={disabled} onClick={(e) => verifyOtp(e)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md cursor-pointer">verify otp</button></div>
                            </div>
                        </div>

                        {/* New Password Field */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="password"
                                className="text-sm font-semibold text-gray-700 ml-1"
                            >
                                New Password
                            </Label>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors h-5 w-5" />
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    disabled={otpVerified}
                                    placeholder="••••••••"
                                    className={`pl-11 pr-11 h-12 rounded-xl border-gray-200 bg-gray-50/30 focus:bg-white transition-all ${errors.newPassword
                                        ? "border-red-500 ring-red-100"
                                        : "focus:ring-blue-100"
                                        }`}
                                />
                                <button
                                    disabled={otpVerified}
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1 ml-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading || otpVerified}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Resetting...
                                </div>
                            ) : (
                                otpSent ? "Reset Password" : "Send Otp"
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default page