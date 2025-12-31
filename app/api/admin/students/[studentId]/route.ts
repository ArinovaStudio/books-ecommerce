import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { verifyAdmin } from '@/lib/verify';
import { Wrapper } from "@/lib/api-handler";

const updateStudentValidation = z.object({
  name: z.string().optional(),
  rollNo: z.string().optional(),
  classId: z.string().uuid().optional(),
  section: z.string().optional(),
  parentEmail: z.string().email().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  isActive: z.boolean().optional(),
});

// update student details
export const PUT = Wrapper(async( req: NextRequest,  { params }: { params: Promise<{ studentId: string }> }) => {
  try {
    const auth = await verifyAdmin(req);
        if (!auth.success){
            return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
        }

    const user = auth.user;
    if (user.role !== "SUB_ADMIN" || !user.schoolId) {
        return NextResponse.json({ success: false, message: "Only School Admins can update students" }, { status: 403 });
    }

    const { studentId } = await params;
    const body = await req.json();

    const validation = updateStudentValidation.safeParse(body);
    if (!validation.success) {
        const errors = validation.error.errors.map((error) => ({ field: error.path[0], message: error.message }));
        return NextResponse.json({ success: false, message: "Validation error", errors }, { status: 400 });
    }

    const existingStudent = await prisma.student.findUnique({ where: { id: studentId } });
    
    if (!existingStudent) {
        return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    if (existingStudent.schoolId !== user.schoolId) {
        return NextResponse.json({ success: false, message: "You can only manage students in your own school" }, { status: 403 });
    }

    const { name, rollNo, classId, section, parentEmail, dob, gender, bloodGroup, address, isActive } = validation.data;

    if ( (rollNo && rollNo !== existingStudent.rollNo) || (classId && classId !== existingStudent.classId) ) {
        const targetClass = classId || existingStudent.classId;
        const targetSection = section || existingStudent.section;
        const targetRoll = rollNo || existingStudent.rollNo;

        const duplicate = await prisma.student.findFirst({
            where: {
                schoolId: user.schoolId,
                classId: targetClass,
                section: targetSection,
                rollNo: targetRoll,
                id: { not: studentId }
            }
        });

        if (duplicate) {
             return NextResponse.json({ success: false, message: "Another student already has this Roll No in that class/section" }, { status: 409 });
        }
    }

    let newParentId = existingStudent.parentId;
    if (parentEmail && parentEmail !== existingStudent.parentEmail) {
        const parentUser = await prisma.user.findUnique({ where: { email: parentEmail } });
        newParentId = parentUser ? parentUser.id : null;
    }

    const updatedStudent = await prisma.student.update({
        where: { id: studentId },
        data: { name, rollNo, classId, section, parentEmail, parentId: newParentId,
            dob: dob ? new Date(dob) : undefined, gender, bloodGroup, address, isActive
        }
    });

    return NextResponse.json({ success: true, message: "Student updated successfully", student: updatedStudent }, { status: 200 });

  } catch (error) {
    console.error("Update Student Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
})


// Delete student details
export const DELETE = Wrapper(async( req: NextRequest, { params }: { params: Promise<{ studentId: string }> }) => {
  try {
    const auth = await verifyAdmin(req);
    if (!auth.success){
        return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
    }

    const user = auth.user;
    const { studentId } = await params;

    const existingStudent = await prisma.student.findUnique({ where: { id: studentId } });
    if (!existingStudent) {
        return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    await prisma.student.delete({ where: { id: studentId } });

    return NextResponse.json({ success: true, message: "Student deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete Student Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
})