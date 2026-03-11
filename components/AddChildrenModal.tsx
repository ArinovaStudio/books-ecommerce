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
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import useSWR from "swr";
import { useRouter } from "next/navigation";
const GENDERS = ["Male", "Female", "Prefer Not To Say"];
const basics = ["Nursery", "PP I", "PP II"];
const upTo8 = [...basics,"Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
const upTo10 = [...upTo8, "Class 9", "Class 10"];
const upTo12 = [...upTo10, "Class 11", "Class 12"];
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
  refreshUser?: any;
};
const fetcher = (url: string) => fetch(url).then((res) => res.json());
export function AddChildrenModal({ open, onOpenChange, schoolId,refreshUser }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [sections, setSections] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState<any | null>(null);
  const [classes,setClasses] = useState<any>([]);
  const [loading,setLoading] = useState(false);
  const { data,isLoading } = useSWR(
    schoolId && `/api/schools/${schoolId}`,
    fetcher
  );
  const school = data?.school ?? null;
    useEffect(() => {
      const ArrangeClasses = () => {
          const updatedClasses = [];
          const tempClasses = school?.classes ?? [];
          for(let cls of upTo12){
            const classIndex = tempClasses.findIndex((item: any)=>item.name===cls);
            if(classIndex!=-1){
              updatedClasses.push(tempClasses[classIndex]);
            }
          }
          setClasses(updatedClasses);
          console.log(updatedClasses);
      };
      ArrangeClasses();
    }, [data]);
  const handleClassChange = (value: string) => {
    if (!school) return;
    setSelectedClass(value);
    const cls = school?.classes?.find((c: any) => c.id === value);
    // console.log(cls.sectionDetails.map((sd: any) => sd.language));
    setLanguages(cls.sectionDetails.map((sd: any) => sd.language));
    setSections(cls?.sectionDetails);
  };

  const handleLangChange = (value: string) => {
    if (!school) return;
    const section = sections.filter(
      (a: any) => a.language.toLowerCase() === value.toLowerCase()
    );

    const selectedSec: any = section.length > 0 ? section[0] : null;
    setSelectedSection(selectedSec ? selectedSec : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) return;
    const fd = new FormData(e.target as any);
    try {
      setLoading(true);
      fd.append("sectionId", selectedSection?.id);
      fd.append("section", selectedSection?.name);
      const data = Object.fromEntries(fd);
      const request = await fetch("/api/user/childrens/add",{method:"POST",body:JSON.stringify(data)});
      const response = await request.json();
      if(!response.success){
        throw Error(response.message);
      }
      toast({
        title: "Success",
        description: "Children Added Successfully!"
      });
      refreshUser();
      setSelectedClass(null);
      setSections([]);
      setSelectedSection(null);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }finally{
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
          {isLoading || !schoolId ? (
            <div>Loading Form...</div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
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
                  <Select
                    name="classId"
                    required
                    onValueChange={handleClassChange}
                  >
                    <SelectTrigger className="px-3 py-2 w-full shadow-sm focus:shaodw-md bg-background outline-none">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes?.map((cls: any) => (
                        <SelectItem key={cls.name} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>First Language</Label>
                  <Select
                    name="language"
                    required
                    onValueChange={handleLangChange}
                    disabled={!selectedClass || sections.length === 0}
                  >
                    <SelectTrigger className="px-3 py-2 w-full shadow-sm focus:shaodw-md bg-background outline-none">
                      <SelectValue
                        placeholder={
                          !selectedClass
                            ? "Select Class First"
                            : sections.length === 0
                            ? "No Language Available"
                            : "Select Language"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {languages?.map((language: string) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Section</Label>
                  <Select
                    name="class"
                    required
                    disabled
                    value={selectedSection?.id || ""}
                  >
                    <SelectTrigger className="px-3 py-2 w-full shadow-sm focus:shaodw-md bg-background outline-none">
                      <SelectValue placeholder="Select Language" />
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
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Children
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
