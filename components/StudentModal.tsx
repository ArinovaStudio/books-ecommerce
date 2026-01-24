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
  const [selectedSection, setSelectedSection] = useState<any | null>(null);

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    const cls = school?.classes?.find((c: any) => c.id === value);
    // console.log(cls);
    setSections(cls?.sectionDetails);
  };

  const handleLangChange = (value: string) => {
    const section = sections.filter((a: any) => a.language.toLowerCase() === value.toLowerCase());
    const selectedSec: any = section.length > 0 ? section[0] : null;
    setSelectedSection(selectedSec ? selectedSec : null);
  }

  const handleSubmit = async (fd: FormData) => {
    
    if (!school) return;
    setLoading(true);
    try {
      fd.append("sectionId", selectedSection?.id);
      fd.append("section", selectedSection?.name);
      
      const data = Object.fromEntries(fd);
      setStudents([...students,{...data, section: selectedSection?.name, sectionId: selectedSection?.id, id:Date.now()}]);
      setSelectedClass(null);
      setSections([]);
      setSelectedSection(null)
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
                  placeholder="Name"
                  className="p-1 border ring-gray-500 bg-background shadow-sm focus:shadow-md outline-none"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Roll No.</Label>
                <Input
                  name="rollNo"
                  placeholder="Roll No."
                  className="p-1 border ring-gray-500 bg-background shadow-sm focus:shadow-md outline-none"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Class</Label>
                <Select name="class" required onValueChange={handleClassChange}>
                  <SelectTrigger className="px-3 py-2 w-full shadow-sm focus:shaodw-md bg-background outline-none">
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
                <Label>First Language</Label>
                <Select name="language" required onValueChange={handleLangChange} 
                  disabled={!selectedClass || sections.length === 0}
                >
                  <SelectTrigger className="px-3 py-2 w-full shadow-sm focus:shaodw-md bg-background outline-none">
                    <SelectValue placeholder={
                        !selectedClass
                          ? "Select Class First"
                          : sections.length === 0
                          ? "No Language Available"
                          : "Select Language"
                      } />
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
                <Label>Section</Label>
                  {/* <Input
                  name="section"
                  placeholder="Select Language first"
                  className="p-1 border ring-gray-500 bg-background shadow-sm focus:shadow-md outline-none"
                  required
                  readOnly
                  value={selectedSection?.name || ""}
                /> */}
                <Select name="class" required disabled value={selectedSection?.id || ""}>
                  <SelectTrigger className="px-3 py-2 w-full shadow-sm focus:shaodw-md bg-background outline-none">
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={selectedSection?.id || "filling"}>
                      {selectedSection?.name || "No Section Selected"}
                    </SelectItem>
                    {/* {school?.classes?.map((cls: any) => (
                    ))} */}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Gender</Label>
                <Select name="gender" required>
                  <SelectTrigger className="px-3 py-2 w-full shadow-sm focus:shaodw-md bg-background outline-none">
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
                  className="px-3 py-2 shadow-sm focus:shadow-md outline-none"
                />
              </div>

              <div className="grid gap-2">
                <Label>Blood Group</Label>
                <Select name="bloodGroup">
                  <SelectTrigger className="px-3 py-2 w-full shadow-sm focus:shaodw-md bg-background outline-none">
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
