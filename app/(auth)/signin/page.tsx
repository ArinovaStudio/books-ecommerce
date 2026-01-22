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
interface FormErrors {
  [key: string]: string;
}

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { clearSchool } = useSchoolHelper();
  const router = useRouter();
  const { toast } = useToast();
  const goBack = useGoBack();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        clearSchool();
        toast({
          title: "Success",
          description: "Signed in successfully",
        });

        const roleRoutes: Record<string, string> = {
          ADMIN: "/admin",
          SUB_ADMIN: "/subadmin",
          USER: "/",
        };
        router.push(roleRoutes[data.user.role] ?? "/");
      } else {
        toast({
          title: "Error",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Button className="text-center absolute left-0" onClick={goBack}><ArrowLeft/>Back</Button>
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl sm:shadow-none sm:bg-transparent p-6 sm:p-0">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            To keep connected with us please login with your email address and
            password.
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
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className={`pl-11 h-12 rounded-xl border-gray-200 bg-gray-50/30 focus:bg-white transition-all ${
                  errors.email
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

          {/* Password Field */}
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-sm font-semibold text-gray-700 ml-1"
            >
              Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors h-5 w-5" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`pl-11 pr-11 h-12 rounded-xl border-gray-200 bg-gray-50/30 focus:bg-white transition-all ${
                  errors.password
                    ? "border-red-500 ring-red-100"
                    : "focus:ring-blue-100"
                }`}
              />
              <button
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

          {/* Links Section */}
          {/* <div className="flex items-center justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            Forgot Password?
                        </Link>
                    </div> */}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing In...
              </div>
            ) : (
              "Login Now"
            )}
          </Button>

          {/* Footer Link */}
          {/* <div className="text-center pt-2">
                        <p className="text-sm text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/signup"
                                className="text-blue-600 hover:underline font-bold"
                            >
                                Create account
                            </Link>
                        </p>
                    </div>*/}
        </form>
      </div>
    </div>
    </>
  );
};

export default SignInPage;
