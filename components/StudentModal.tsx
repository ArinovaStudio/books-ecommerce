"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@radix-ui/react-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageIcon, Loader2, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "./ui/input";

type School = {
  id: string;
  name: string;
  email?: string;
  address: string;
  classRange?: string;
  languages?: string[];
  board?: string;
  image?: string;
  classes?: any;
};
const GENDERS = ["Male", "Female", "Prefer Not To Say"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  school?: School | null;
  students?: any;
  setStudents?: any;
};

export function StudentModal({
  open,
  onOpenChange,
  school,
  students,
  setStudents,
}: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [sections, setSections] = useState<string[]>([]);
  const fetchStudent = (id: string) => {};
  const handleClassChange = (value: string) => {
    setSelectedClass(value);

    const cls = school?.classes?.find((c: any) => c.id === value);
    console.log(cls);
    setSections(cls?.sectionDetails);
  };

  const handleSubmit = async (fd: FormData) => {
    if (!school) return;
    setLoading(true);
    try {
      const data = Object.fromEntries(fd);
      setStudents([...students,{...data,id:Date.now()}]);
      setSelectedClass(null);
      setSections([]);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <DialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-6 shadow-lg focus:outline-none max-h-[90vh] overflow-y-auto">
          <div className="mb-6">
            <DialogTitle className="text-xl font-semibold">
              Student Details
            </DialogTitle>
          </div>

          <form action={handleSubmit} className="grid grid-cols-1 gap-8">
            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  name="name"
                  className="p-1 rounded-xl border ring-gray-500 bg-background ring-1 outline-none"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Roll No.</Label>
                <Input
                  name="rollNo"
                  className="p-1 rounded-xl border ring-gray-500 bg-background ring-1 outline-none"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Class</Label>
                <Select name="class" required onValueChange={handleClassChange}>
                  <SelectTrigger className="px-3 py-2 w-full rounded-xl border ring-1 bg-background outline-none">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {school?.classes?.map((cls: any) => (
                      <SelectItem key={cls.name} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Section</Label>
                <Select
                  name="section"
                  required
                  disabled={!selectedClass || sections.length === 0}
                >
                  <SelectTrigger className="px-3 py-2 w-full rounded-xl border ring-1 bg-background outline-none">
                    <SelectValue
                      placeholder={
                        !selectedClass
                          ? "Select Class First"
                          : sections.length === 0
                          ? "No Sections Available"
                          : "Select Section"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.length > 0 ? (
                      sections.map((section: any) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No sections available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>First Language</Label>
                <Select name="language" required>
                  <SelectTrigger className="px-3 py-2 w-full rounded-xl border ring-1 bg-background outline-none">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {school?.languages?.map((language: string) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Gender</Label>
                <Select name="gender" required>
                  <SelectTrigger className="px-3 py-2 w-full rounded-xl border ring-1 bg-background outline-none">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((gender: string) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Date Of Birth</Label>
                <Input
                  type="date"
                  name="dob"
                  className="px-3 py-2 w-full rounded-xl border border-gray-400 bg-background outline-none"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Blood Group</Label>
                <Select name="bloodGroup" required>
                  <SelectTrigger className="px-3 py-2 w-full rounded-xl border ring-1 bg-background outline-none">
                    <SelectValue placeholder="Select Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((group: string) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-1 border-t col-span-full">
              <Button
                variant="ghost"
                type="button"
                className="hover:bg-transparent"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="px-8" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
                Save Student
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
