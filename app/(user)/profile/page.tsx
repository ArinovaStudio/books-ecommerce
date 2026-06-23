"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  Droplets,
  Baby,
  LogOut,
  LockKeyhole,
  Map,
  LucideArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser, UserProfile } from "@/app/context/userContext";
import Link from "next/link";
import { AddChildrenModal } from "@/components/AddChildrenModal";
import TrackOrders from "@/components/order/TrackingOrder";



const ProfilePage = () => {
  const { user, loading, logout, refreshUser } = useUser();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [trackingModel, setTrackingModel] = useState(false)
  useEffect(() => {
    if (!loading && user) {
      setProfile(user as any);
    }
  }, [user]);
  const schoolId = (user as any)?.schoolId;
  return (
    <div className="min-h-screen w-full bg-gray-50/50 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      {trackingModel && user && <TrackOrders close={() => setTrackingModel(false)} userId={user.email} />}
      <div className="w-full max-w-6xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              User Profile
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Manage account and student details
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[calc(100vh-160px)]">
          {/* Left Column: Personal Info */}
          <div className="lg:col-span-1">
            <Card className="rounded-3xl pb-0 shadow-sm border-gray-100 sticky top-4 overflow-hidden flex flex-col">
              <CardHeader>
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-blue-50 bg-white rounded-full flex items-center justify-center shadow-inner">
                    <User size={32} className="text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl font-bold mb-2">
                      {profile?.name}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        profile?.status === "ACTIVE"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      {profile?.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 sm:p-6 space-y-4 text-sm border-t border-gray-50 flex-grow mb-6">
                <div className="flex items-center gap-3 text-gray-600 break-all">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Mail size={16} className="text-blue-600" />
                  </div>
                  {profile?.email}
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Phone size={16} className="text-blue-600" />
                  </div>
                  {profile?.phone ?? "Not provided"}
                </div>

                <div className="flex items-start gap-3 text-gray-600">
                  <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                    <Map size={16} className="text-blue-600" />
                  </div>

                  <span className="leading-relaxed">
                    {profile?.address ?? "No Address"}{" "}
                    {profile?.pincode ? `, ${profile.pincode}` : ""}
                  </span>
                </div>

                <div onClick={() => setTrackingModel(true)} className="flex items-center justify-between gap-3 text-white cursor-pointer bg-blue-600/60  rounded-full py-2 px-2 pl-4">
                  Track Orders
                  <div className="p-2 bg-blue-50 rounded-full">
                    <LucideArrowRight size={16} className="text-blue-600" />
                  </div>
                </div>
              </CardContent>
              <div className="grid gap-0 w-full">
                <Link href={"/change-password"}>
                  <Button
                    variant="secondary"
                    type="button"
                    className="w-full text-center h-14 rounded-none border-t border-gray-100 bg-gray-50 hover:bg-gray-60 text-gray-600 font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LockKeyhole size={18} />
                    Change Password
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  onClick={logout}
                  className="w-full text-center h-14 rounded-none border-t border-gray-100 bg-gray-50 hover:bg-red-50 hover:text-red-600 text-gray-600 font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut size={18} />
                  Logout
                </Button>
              </div>
            </Card>
          </div>
          <AddChildrenModal
            refreshUser={refreshUser}
            open={modalOpen}
            onOpenChange={setModalOpen}
            schoolId={schoolId}
          />
          {/* Right Column: Students List */}
          <div className="lg:col-span-2 flex flex-col gap-4 lg:overflow-hidden">
            <div className="flex justify-between items-center">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2 px-1">
                <Baby size={20} className="text-blue-600" />
                Registered Students ({profile?.children?.length})
              </h2>
              <Button
                onClick={() => setModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                + Add Children
              </Button>
            </div>
            <div className="space-y-4 lg:overflow-y-auto lg:pr-2 scrollbar-thin scrollbar-thumb-gray-200">
              {profile?.children?.map((student) => (
                <Card
                  key={student.id}
                  className="rounded-2xl border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group border-l-4 border-l-transparent hover:border-l-blue-600"
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                          <GraduationCap size={20} className="text-blue-600" />
                        </div>

                        <div>
                          <h3 className="font-bold text-sm sm:text-base text-gray-900">
                            {student.name}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {student.class.name} • Section {student.section} •
                            Roll #{student.rollNo}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {student.school}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-50">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase text-gray-400 font-bold">
                          DOB
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-gray-700">
                          <Calendar size={12} className="text-blue-500" />
                          {student.dob
                            ? new Date(student.dob).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-center">
                        <span className="text-[10px] uppercase text-gray-400 font-bold">
                          Gender
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-gray-700">
                          <User size={12} className="text-blue-500" />
                          {student.gender ?? "N/A"}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <span className="text-[10px] uppercase text-gray-400 font-bold">
                          Blood Group
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                          <Droplets size={12} />
                          {student.bloodGroup ?? "N/A"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
