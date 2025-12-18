import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/verify"; 
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

function getCurrentAcademicYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); 

  if (month < 3) {
    return `${year - 1}-${year}`;
  } 
  
  return `${year}-${year + 1}`;
}

const createClassValidation = z.object({
  name: z.string().min(1, "Class name is required"), 
  sections: z.array(z.string()).min(1, "At least one section is required"), 
  academicYear: z.string().optional(), 
  schoolId: z.string().uuid().optional() 
});

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdmin(req);
    if (!auth.success) {
        return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
    }

    const user = auth.user;
    const body = await req.json();

    const validation = createClassValidation.safeParse(body);
    if (!validation.success) {
        const errors = validation.error.errors.map((error) => ({ field: error.path[0], message: error.message }));
        return NextResponse.json({ success: false, message: "Validation error", errors }, { status: 400 });
    }

    const { name, sections, schoolId } = validation.data;
    const academicYear = validation.data.academicYear || getCurrentAcademicYear();

    let targetSchoolId = "";

    if (user.role === "SUB_ADMIN") {
        if (!user.schoolId) {
            return NextResponse.json({ success: false, message: "No school linked to this Sub-Admin" }, { status: 403 });
        }
        targetSchoolId = user.schoolId;
    } else {
        if (!schoolId) {
            return NextResponse.json({ success: false, message: "School ID is required" }, { status: 400 });
        }
        targetSchoolId = schoolId;
    }

    const schoolExists = await prisma.school.findUnique({ where: { id: targetSchoolId } });
    if (!schoolExists) {
      return NextResponse.json({ success: false, message: "School not found" }, { status: 404 });
    }

    const existingClass = await prisma.class.findFirst({ where: { schoolId: targetSchoolId, name: { equals: name, mode: "insensitive" }, academicYear }  });

    if (existingClass) {
      return NextResponse.json( { success: false, message: `Class '${name}' already exists for session ${academicYear}` }, { status: 409 });
    }

    const newClass = await prisma.$transaction(async (tx) => {
        const createdClass = await tx.class.create({ data: { name, schoolId: targetSchoolId, sections, academicYear }});

        await tx.school.update({ where: { id: targetSchoolId }, data: { numberOfClasses: { increment: 1 } }});

        return createdClass;
    });

    return NextResponse.json( { success: true, message: "Class created successfully", class: newClass }, { status: 201 } );

  } catch (error) {
    console.error("Create Class Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}