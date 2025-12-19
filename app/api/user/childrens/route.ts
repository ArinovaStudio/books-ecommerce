import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from '@/lib/verify';
import { getFullImageUrl } from '@/lib/upload';
import { Wrapper } from "@/lib/api-handler";

export const GET = Wrapper(async (req: NextRequest) => {
  try {
    const auth = await verifyUser(req);
    if (!auth.success) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = auth.user;

    const students = await prisma.student.findMany({
        where: { parentId: user.id },
        include: {
            school: {
                select: { name: true, image: true, board: true }
            },
            class: {
                select: { name: true, academicYear: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    students.forEach((student) => {
        if (student.school.image) {
            student.school.image = getFullImageUrl(student.school.image, req);
        }
    });

    return NextResponse.json({ success: true, childrens: students }, { status: 200 });

  } catch (error) {
    console.error("Fetch Parent Students Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
})