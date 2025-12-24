import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = Wrapper(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ classId: string }> }
  ) => {
    try {
      const auth = await verifyAdmin(req);

      if (!auth.success) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 403 }
        );
      }

      const { classId } = await params;

      const existingClass = await prisma.class.findUnique({
        where: { id: classId },
        select: {
          sections: true,
          schoolId: true,
        },
      });

      if (!existingClass) {
        return NextResponse.json(
          { success: false, message: "Class not found" },
          { status: 404 }
        );
      }

      // 🔐 Sub-admin restriction
      if (auth.user.role === "SUB_ADMIN") {
        if (
          !auth.user.schoolId ||
          auth.user.schoolId !== existingClass.schoolId
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "You are not authorized to view this school's classes",
            },
            { status: 403 }
          );
        }
      }

      return NextResponse.json({
        success: true,
        sections: existingClass.sections ?? [],
      });
    } catch (error) {
      console.error("Get sections error:", error);
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    }
  }
);

const addSectionSchema = z.object({
  section: z.string().min(1, "Section name is required"),
});

// Add a section in section array of class
export const POST = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ classId: string }> }) => {
  const auth = await verifyAdmin(req);
  if (!auth.success) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { classId } = await params;
  const body = await req.json();
  const validation = addSectionSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ success: false, message: "Validation error", errors: validation.error.errors[0].message }, { status: 400 });
  }

  const { section } = validation.data;

  const existingClass = await prisma.class.findUnique({ where: { id: classId }, select: { sections: true, schoolId: true } });
  if (!existingClass) {
    return NextResponse.json({ success: false, message: "Class not found" }, { status: 404 });
  }

  // Sub admin check
  if (auth.user.role === "SUB_ADMIN") {
    if (!auth.user.schoolId || auth.user.schoolId !== existingClass.schoolId) {
      return NextResponse.json({ success: false, message: "You are not authorized to manage this school's classes" }, { status: 403 });
    }
  }

  if (existingClass.sections.includes(section)) {
    return NextResponse.json({ success: false, message: "Section already exists" }, { status: 409 });
  }

  const updatedClass = await prisma.class.update({
    where: { id: classId },
    data: {
      sections: { push: section }
    },
    select: { sections: true }
  });

  return NextResponse.json({ success: true, message: "Section added successfully", sections: updatedClass.sections });
});

const updateSectionSchema = z.object({
  oldSection: z.string().min(1, "Old section name is required"),
  newSection: z.string().min(1, "New section name is required"),
});

// Update a section name in section array of class
export const PUT = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ classId: string }> }) => {
  const auth = await verifyAdmin(req);
  if (!auth.success) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { classId } = await params;
  const body = await req.json();
  const validation = updateSectionSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ success: false, message: "Validation error", errors: validation.error.errors[0].message }, { status: 400 });
  }

  const { oldSection, newSection } = validation.data;

  const existingClass = await prisma.class.findUnique({ where: { id: classId }, select: { sections: true, schoolId: true } });
  if (!existingClass) {
    return NextResponse.json({ success: false, message: "Class not found" }, { status: 404 });
  }

  // Sub admin check
  if (auth.user.role === "SUB_ADMIN") {
    if (!auth.user.schoolId || auth.user.schoolId !== existingClass.schoolId) {
      return NextResponse.json({ success: false, message: "You are not authorized to manage this school's classes" }, { status: 403 });
    }
  }

  if (!existingClass.sections.includes(oldSection)) {
    return NextResponse.json({ success: false, message: "Old section not found" }, { status: 404 });
  }

  const updatedSections = existingClass.sections.map(s => s === oldSection ? newSection : s); // update the section

  const updatedClass = await prisma.class.update({
    where: { id: classId },
    data: { sections: updatedSections },
    select: { sections: true }
  });

  return NextResponse.json({ success: true, message: "Section updated successfully", sections: updatedClass.sections });
});

const deleteSectionSchema = z.object({
  section: z.string().min(1, "Section name is required"),
});

// Delete a section in section array of class
export const DELETE = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ classId: string }> }) => {
  const auth = await verifyAdmin(req);
  if (!auth.success) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { classId } = await params;
  const body = await req.json();
  const validation = deleteSectionSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ success: false, message: "Validation error", errors: validation.error.errors[0].message }, { status: 400 });
  }

  const { section } = validation.data;


  const existingClass = await prisma.class.findUnique({ where: { id: classId }, select: { sections: true, schoolId: true } });
  if (!existingClass) {
    return NextResponse.json({ success: false, message: "Class not found" }, { status: 404 });
  }

  // Sub admin check
  if (auth.user.role === "SUB_ADMIN") {
    if (!auth.user.schoolId || auth.user.schoolId !== existingClass.schoolId) {
      return NextResponse.json({ success: false, message: "You are not authorized to manage this school's classes" }, { status: 403 });
    }
  }

  if (!existingClass.sections.includes(section)) {
    return NextResponse.json({ success: false, message: "Section not found" }, { status: 404 });
  }

  const newSections = existingClass.sections.filter(s => s !== section);  // remove the section

  const updatedClass = await prisma.class.update({
    where: { id: classId },
    data: { sections: newSections },
    select: { sections: true }
  });

  return NextResponse.json({ success: true, message: "Section deleted successfully", sections: updatedClass.sections });
});