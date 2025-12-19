import prisma from "@/lib/prisma";
import { getFullImageUrl } from "@/lib/upload";
import { verifyUser } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const parentUpdateValidation = z.object({
  name: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
});

export async function PUT( req: NextRequest, { params }: { params: Promise<{ studentId: string }> } ) {
  try {
    const auth = await verifyUser(req);
    if (!auth.success) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = auth.user;
    const { studentId } = await params;
    const body = await req.json();

    const validation = parentUpdateValidation.safeParse(body);
    if (!validation.success) {
        const errors = validation.error.errors.map((error) => ({ field: error.path[0], message: error.message }));
        return NextResponse.json({ success: false, message: "Validation error", errors }, { status: 400 });
    }

    const { name, dob, gender, bloodGroup, address } = validation.data;

    const existingStudent = await prisma.student.findUnique({ where: { id: studentId } });

    if (!existingStudent) {
        return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    if (existingStudent.parentId !== user.id) {
        return NextResponse.json({ success: false, message: "You can only update your own children" }, { status: 403 });
    }

    const updatedStudent = await prisma.student.update({
        where: { id: studentId },
        data: { name, dob: dob ? new Date(dob) : undefined, gender, bloodGroup, address }
    });

    return NextResponse.json({ 
        success: true, 
        message: "Student profile updated successfully", 
        student: updatedStudent 
    }, { status: 200 });

  } catch (error) {
    console.error("Parent Update Student Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET( req: NextRequest, { params }: { params: Promise<{ studentId: string }> } ) {
  try {
    const auth = await verifyUser(req);
    if (!auth.success) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { studentId } = await params;
    const user = auth.user;

    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
            school: {
                select: { name: true, image: true, board: true }
            },
            class: {
                select: { name: true, academicYear: true }
            }
        }
    });

    student?.school.image && (student.school.image = getFullImageUrl(student.school.image, req));

    if (!student) {
        return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    if (student.parentId !== user.id) {
        return NextResponse.json({ success: false, message: "You can only view your own children" }, { status: 403 });
    }

    return NextResponse.json({ success: true, student }, { status: 200 });

  } catch (error) {
    console.error("Fetch Single Student Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

