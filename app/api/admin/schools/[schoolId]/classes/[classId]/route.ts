import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";

export const GET = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ schoolId: string, classId: string }> }) => {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        if (auth.user.role !== "ADMIN" || auth.user.role !== "SUB_ADMIN") {
            return NextResponse.json({ success: false, message: "Only Admin can view users" }, { status: 403 });
        }

        const { schoolId, classId } = await params;

        const users = await prisma.user.findMany({
            where: {
                children: {
                    some: {
                        classId: classId,
                        schoolId: schoolId
                    }
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                createdAt: true,
            },
            orderBy: { name: 'asc' }
        });

        const formattedUsers = users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone || "N/A",
            role: u.role,
            status: u.status,
            joinDate: new Date(u.createdAt).toLocaleDateString()
        }));

        return NextResponse.json({ success: true, users: formattedUsers }, { status: 200 });

    } catch (error) {
        console.error("Fetch Users Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
});