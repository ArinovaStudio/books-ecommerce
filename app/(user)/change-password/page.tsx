"use client";

import { useRef, useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
export default function ChangePasswordPage() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);
  const changePasswordHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as any);
    const { currentPass, newPass, confirmNewPass } = Object.fromEntries(fd);
    if (!currentPass || !newPass || !confirmNewPass) {
      setError("All Fields Are Required!");
      return;
    }
    if (newPass !== confirmNewPass) {
      setError("Passwords Doesn't Match!");
      return;
    }
    if (newPass.toString().length < 8) {
      setError("New Password Must be of length 8 at least!");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const request = await fetch("/api/user/change-password", {
        method: "POST",
        body: JSON.stringify({ newPass, currentPass }),
      });
      const response = await request.json();
      if (!response.success) {
        throw Error(response.message);
      }
      toast.success(response.message);
      (formRef?.current as any)?.reset();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center">
            <KeyRound className="text-blue-500" />
          </div>

          <CardTitle className="text-2xl">Change Password</CardTitle>

          <CardDescription>
            Update your account password securely
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form
            ref={formRef}
            className="grid gap-3"
            onSubmit={changePasswordHandler}
          >
            {/* Old Password */}
            <div className="space-y-2">
              <Label>Current Password</Label>

              <div className="relative">
                <Input
                  type={showOld ? "text" : "password"}
                  name="currentPass"
                  disabled={loading}
                  placeholder="Enter current password"
                />

                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-2.5 text-muted-foreground"
                >
                  {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label>New Password</Label>

              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  name="newPass"
                  disabled={loading}
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 text-muted-foreground"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label>Confirm Password</Label>

              <div className="relative">
                <Input
                  disabled={loading}
                  type={showConfirm ? "text" : "password"}
                  name="confirmNewPass"
                  placeholder="Confirm new password"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-muted-foreground"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-xs font-bold uppercase">
                {error}
              </div>
            )}
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600!"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
