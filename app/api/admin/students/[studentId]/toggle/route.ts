import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from '@/lib/verify';
import { Wrapper } from "@/lib/api-handler";

// toggle student status
export const PATCH = Wrapper(async( req: NextRequest, { params }: { params: Promise<{ studentId: string }> } ) => {
  try {
    const auth = await verifyAdmin(req);
    if (!auth.success){
        return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
    }

    const user = auth.user;

    // if (user.role !== "SUB_ADMIN" || !user.schoolId) {
    //     return NextResponse.json({ success: false, message: "Only School Admins can manage students" }, { status: 403 });
    // }

    const { studentId } = await params;

    const existingStudent = await prisma.student.findUnique({ where: { id: studentId } });

    if (!existingStudent) {
        return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }


    const newStatus = !existingStudent.isActive;

    const updatedStudent = await prisma.student.update({ where: { id: studentId }, data: { isActive: newStatus }});

    return NextResponse.json({ success: true, message: `Student ${newStatus ? 'activated' : 'deactivated'} successfully`}, { status: 200 });

  } catch (error) {
    console.error("Toggle Student Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
})