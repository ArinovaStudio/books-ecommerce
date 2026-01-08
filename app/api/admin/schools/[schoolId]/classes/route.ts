import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { verifyUser } from "@/lib/verify"; 
import { NextRequest, NextResponse } from "next/server";

export const GET = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ schoolId: string }> }) => {
    try {
        const auth = await verifyUser(req);

        if (!auth.success || !auth.user) {
            return NextResponse.json({ success: false, message: "Login required to view classes" }, { status: 401 });
        }

        const { schoolId } = await params;

        if (!schoolId) {
            return NextResponse.json({ success: false, message: "School ID is required" }, { status: 400 });
        }

        const user = auth.user;
        let classes = [];

        if (user.role === "ADMIN" || user.role === "SUB_ADMIN") {
            
            if (user.role === "SUB_ADMIN" && user.schoolId !== schoolId) {
                return NextResponse.json({ success: false, message: "Unauthorized access to this school" }, { status: 403 });
            }

            classes = await prisma.class.findMany({
                where: { schoolId },
                select: { 
                    id: true, 
                    name: true,
                    sectionDetails: {
                        select: { id: true, name: true, language: true }
                    }
                },
                orderBy: { name: 'asc' }
            });

        } 
        
        else {

            const myStudents = await prisma.student.findMany({
                where: {
                    parentId: user.id,
                    schoolId: schoolId,
                    isActive: true
                },
                select: { classId: true, sectionId: true }
            });

            if (myStudents.length === 0) {
                return NextResponse.json({ success: true, classes: [] }, { status: 200 });
            }

            const allowedClassIds = myStudents.map(s => s.classId);
            const allowedSectionIds = myStudents.map(s => s.sectionId);

            classes = await prisma.class.findMany({
                where: {
                    schoolId,
                    id: { in: allowedClassIds } 
                },
                select: {
                    id: true,
                    name: true,
                    sectionDetails: {
                        where: { id: { in: allowedSectionIds } },
                        select: { id: true, name: true, language: true }
                    }
                },
                orderBy: { name: 'asc' }
            });
        }

        return NextResponse.json({ success: true, classes }, { status: 200 });

    } catch (error) {
        console.error("Fetch Classes Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
});