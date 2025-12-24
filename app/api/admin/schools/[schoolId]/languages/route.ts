import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { verifyAdmin } from '@/lib/verify';
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// Get all languages of a school
export const GET = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ schoolId: string }> }) => {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
        }

        const schoolId = (await params).schoolId;

        const school = await prisma.school.findUnique({ where: { id: schoolId }, select: { languages: true } })

        if (!school) {
            return NextResponse.json({ success: false, message: "School not found" }, { status: 404 });
        }

        if (auth.user.role === "SUB_ADMIN") {
            if (!auth.user.schoolId || auth.user.schoolId !== schoolId) {
                return NextResponse.json({ success: false, message: "You are not authorized to manage this school's languages" }, { status: 403 });
            }
        }

        return NextResponse.json({ success: true, languages: school?.languages }, { status: 200 });
    } catch (error) {
        console.error("Language Fetch Error", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
})

const addLangSchema = z.object({
  language: z.string().min(1, "Language name is required"),
});

// Add language in language array of school
export const POST = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ schoolId: string }> }) => {
  const auth = await verifyAdmin(req);
  if (!auth.success) { 
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { schoolId } = await params;
  const body = await req.json();
  const validation = addLangSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ success: false, message: "Validation error", errors: validation.error.errors[0].message }, { status: 400 });
  }

  const { language } = validation.data;

  const existingSchool = await prisma.school.findUnique({ 
    where: { id: schoolId }, 
    select: { languages: true, id: true } 
  });

  if (!existingSchool) {
    return NextResponse.json({ success: false, message: "School not found" }, { status: 404 });
  }

   // Sub admin check
  if (auth.user.role === "SUB_ADMIN") {
    if (!auth.user.schoolId || auth.user.schoolId !== schoolId) {
        return NextResponse.json({ success: false, message: "You are not authorized to manage this school's languages" }, { status: 403 });
    }
}   

  if (existingSchool.languages.includes(language)) {
    return NextResponse.json({ success: false, message: "Language already exists" }, { status: 409 });
  }

  const updatedSchool = await prisma.school.update({
    where: { id: schoolId },
    data: {
      languages: { push: language }
    },
    select: { languages: true }
  });

  return NextResponse.json({ success: true, message: "Language added successfully", languages: updatedSchool.languages });
});


const updateLangSchema = z.object({
  oldLanguage: z.string().min(1, "Old language name is required"),
  newLanguage: z.string().min(1, "New language name is required"),
});

// Update a language name in language array of school
export const PUT = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ schoolId: string }> }) => {
  const auth = await verifyAdmin(req);
  if (!auth.success) { 
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { schoolId } = await params;
  const body = await req.json();
  const validation = updateLangSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ success: false, message: "Validation error", errors: validation.error.errors[0].message }, { status: 400 });
  }

  const { oldLanguage, newLanguage } = validation.data;

  const existingSchool = await prisma.school.findUnique({ 
    where: { id: schoolId }, 
    select: { languages: true } 
  });

  if (!existingSchool) {
    return NextResponse.json({ success: false, message: "School not found" }, { status: 404 });
  }

   // Sub admin check
  if (auth.user.role === "SUB_ADMIN") {
    if (!auth.user.schoolId || auth.user.schoolId !== schoolId) {
        return NextResponse.json({ success: false, message: "You are not authorized to manage this school's languages" }, { status: 403 });
    }
  } 

  if (!existingSchool.languages.includes(oldLanguage)) {
    return NextResponse.json({ success: false, message: "Old language not found" }, { status: 404 });
  }

  if (existingSchool.languages.includes(newLanguage)) {
      return NextResponse.json({ success: false, message: "New language name already exists" }, { status: 409 });
  }

  const updatedLanguages = existingSchool.languages.map(l => l === oldLanguage ? newLanguage : l);

  const updatedSchool = await prisma.school.update({
    where: { id: schoolId },
    data: { languages: updatedLanguages },
    select: { languages: true }
  });

  return NextResponse.json({ success: true, message: "Language updated successfully", languages: updatedSchool.languages });
});

const deleteLangSchema = z.object({
  language: z.string().min(1, "Language name is required"),
});

// Delete a language in language array of school
export const DELETE = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ schoolId: string }> }) => {
  const auth = await verifyAdmin(req);
  if (!auth.success) { 
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { schoolId } = await params;
  const body = await req.json(); 
  const validation = deleteLangSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ success: false, message: "Validation error", errors: validation.error.errors[0].message }, { status: 400 });
  }

  const { language } = validation.data;

  const existingSchool = await prisma.school.findUnique({ 
    where: { id: schoolId }, 
    select: { languages: true } 
  });

  if (!existingSchool) {
    return NextResponse.json({ success: false, message: "School not found" }, { status: 404 });
  }

  // Sub admin check
  if (auth.user.role === "SUB_ADMIN") {
    if (!auth.user.schoolId || auth.user.schoolId !== schoolId) {
        return NextResponse.json({ success: false, message: "You are not authorized to manage this school's languages" }, { status: 403 });
    }
  } 

  if (!existingSchool.languages.includes(language)) {
    return NextResponse.json({ success: false, message: "Language not found" }, { status: 404 });
  }

  const newLanguages = existingSchool.languages.filter(l => l !== language);

  const updatedSchool = await prisma.school.update({
    where: { id: schoolId },
    data: { languages: newLanguages },
    select: { languages: true }
  });

  return NextResponse.json({ success: true, message: "Language deleted successfully", languages: updatedSchool.languages });
});