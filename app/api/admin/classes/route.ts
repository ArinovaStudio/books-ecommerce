import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/verify-admin";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const createClassValidation = z.object({
  name: z.string().min(1, "Class name is required"),
  schoolId: z.string().uuid("Invalid School ID"),
  sections: z.array(z.string()).min(1, "At least one section is required")
});

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdmin(req);

    if (!auth.success){
        return NextResponse.json({ success: false, message: "Admin access required", status: 403 });
    }

    const body = await req.json();

    const validation = createClassValidation.safeParse(body);
    if (!validation.success) {
        const errors = validation.error.errors.map((error) => ({ field: error.path[0], message: error.message }));;
        return NextResponse.json({ success: false, message: "Vlidation error", errors }, { status: 400 });
    }

    const { name, schoolId, sections } = validation.data;

    const schoolExists = await prisma.school.findUnique({ where: { id: schoolId } });

    if (!schoolExists) {
      return NextResponse.json({ success: false, message: "School not found" }, { status: 404 });
    }

    const existingClass = await prisma.class.findFirst({ where: { schoolId, name: { equals: name, mode: "insensitive" } }});

    if (existingClass) {
      return NextResponse.json( { success: false, message: "Class already exists" }, { status: 400 });
    }

    const newClass = await prisma.class.create({ data: { name, schoolId, sections }});

    await prisma.school.update({ where: { id: schoolId }, data: { numberOfClasses: { increment: 1 } }});

    return NextResponse.json( { success: true, message: "Class created successfully", class: newClass }, { status: 201 } );

  } catch (error) {
    console.error("Create Class Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}



