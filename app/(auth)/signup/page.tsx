"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  MapPin,
  Phone,
  ChevronRight,
  Unlink,
  School,
  Loader2,
} from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useSchoolHelper } from "@/hooks/useSchoolHelper";
import { useSearchParams } from "next/navigation";
import { StudentModal } from "@/components/StudentModal";
import StudentActionsTable from "@/components/StudentActionsTable";
interface School {
  id: string;
  name: string;
}
interface FormDataStructure {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  school: null | School;
}
type SchoolStructure = {
  id: string;
  name: string;
  email?: string;
  address: string;
  classRange?: string;
  languages?: string[];
  board?: string;
  image?: string;
};
const SignUpPage = () => {
  const searchParams =  useSearchParams();
  if(!searchParams.get("id")){
    return <div className="flex items-center justify-center h-full font-semibold text-red-400">Access Is Forbidden!</div>;
  }
  const [formData, setFormData] = useState<FormDataStructure>({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    school: null,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [school, setSchool] = useState<SchoolStructure | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const id = searchParams.get("id");
  useEffect(() => {
    const fetchData = async () => {
      const request = await fetch(`/api/schools/${id}`);
      const response = await request.json();
      if (response.success) {
        setSchool(response.school);
        setFormData({
          ...formData,
          school: {
            id: response.school.id as string,
            name: response.school.name as string,
          },
        });
      }
      setLoaded(true);
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

      try {
        const data = {
          parent: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            password: formData.password,
          },
          students: students,
          schoolInfo: {
            schoolId: id,
          },
        };
        const request = await fetch("/api/auth/newsignup", {
          method: "POST",
          body: JSON.stringify(data),
        });
        const response = await request.json();
        if (response.success) {
          toast({
            title: "Success",
            description: response.message,
          });
          router.push("/");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
  };

  const removeStudent = (id: string) => {
    setStudents(students.filter((student: any) => student.id !== id));
  };

  return (
    <div className="h-screen w-full bg-gray-50/50 flex items-center justify-center p-4 overflow-hidden ">
      <StudentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        school={school}
        students={students}
        setStudents={setStudents}
      />
      {/* Container fits within 90% of laptop screen height */}
      {loaded ? (
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl  border border-gray-100 flex flex-col max-h-[90vh]">
          <div className="overflow-y-auto p-6 sm:p-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                Create Account
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Enter your details to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
                  <Label className="text-xs font-semibold text-gray-700 ml-1">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`pl-9 h-11 rounded-xl bg-gray-50 text-sm ${
                        errors.name
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[10px] text-red-500 ml-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
                  <Label className="text-xs font-semibold text-gray-700 ml-1">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className={`pl-9 h-11 rounded-xl bg-gray-50 text-sm ${
                        errors.email
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[10px] text-red-500 ml-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-700 ml-1">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="1234567890"
                      className={`pl-9 h-11 rounded-xl bg-gray-50 text-sm ${
                        errors.phone
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[10px] text-red-500 ml-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-700 ml-1">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`pl-9 pr-9 h-11 rounded-xl bg-gray-50 text-sm ${
                        errors.password
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[10px] text-red-500 ml-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* School */}
              {formData.school && (
                <>
                  <div className="space-y-1.5">
                    <Input
                      type="hidden"
                      name={"schoolId"}
                      disabled
                      value={formData.school.id}
                    />
                    <Label className="text-xs font-semibold text-gray-700 ml-1">
                      School
                    </Label>
                    <div className="relative">
                      <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={
                          formData.school.name || "This is value from my side"
                        }
                        disabled
                        onChange={handleChange}
                        className={`pl-9 pr-9 w-full h-11 rounded-xl bg-gray-50 text-sm ${
                          errors.school
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <Button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="ml-auto"
                    >
                      Add Student +
                    </Button>
                    <StudentActionsTable
                      students={students}
                      deleteStudent={removeStudent}
                    />
                  </div>
                </>
              )}
              {/* Address */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700 ml-1">
                  Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Enter full address"
                    className={`w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 p-3 resize-none text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                      errors.address ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.address && (
                  <p className="text-[10px] text-red-500 ml-1">
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="pt-4 flex flex-col items-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    "Creating Account..."
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign Up <ChevronRight size={18} />
                    </span>
                  )}
                </Button>

                <p className="mt-6 text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="text-blue-600 hover:underline font-bold"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <Loader2 size={30} className="animate-spin" />
      )}
    </div>
  );
};

export default SignUpPage;
