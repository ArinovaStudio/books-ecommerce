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
    const body = await req.json();
    const { isActive } = body;

    if (typeof isActive !== "boolean") {
        return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
    }

    const { studentId } = await params;

    const existingStudent = await prisma.student.findUnique({ where: { id: studentId } });

    if (!existingStudent) {
        return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    if (user.role === "SUB_ADMIN" && existingStudent.schoolId !== user.schoolId) {
        return NextResponse.json({ success: false, message: "You can only modify students in your own school" }, { status: 403 });
    }

    const updatedStudent = await prisma.student.update({ where: { id: studentId }, data: { isActive }});

    return NextResponse.json({ success: true, message: `Student ${isActive ? 'activated' : 'deactivated'} successfully`}, { status: 200 });

  } catch (error) {
    console.error("Toggle Student Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
})