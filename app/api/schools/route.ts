import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { getFullImageUrl } from "@/lib/upload";
import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/lib/verify";

export const GET = Wrapper(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    let whereClause: any = {};
    
    if (search) {
      whereClause = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { board: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const auth = await verifyUser(req);

    if (auth.success && auth.user) {
        
        if (auth.user.role === 'USER') {
            const students = await prisma.student.findMany({
                where: {
                    parentId: auth.user.id,
                    isActive: true
                },
                select: { schoolId: true }
            });

            const schoolIds = students.map(s => s.schoolId);

            if (schoolIds.length > 0) {
                whereClause.id = { in: schoolIds };
            }
        }
        
    }

    const schools = await prisma.school.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    if (!schools || schools.length === 0) {
      if (auth.success && auth.user?.role === 'USER' && Object.keys(whereClause).includes('id')) {
          return NextResponse.json({ success: true, message: "No schools found linked to your children", schools: [] }, { status: 200 });
      }
      return NextResponse.json({ success: false, message: "Schools not found" }, { status: 404 });
    }

    for (const school of schools) {
      if (school.image) {
        school.image = getFullImageUrl(school.image, req);
      }
    }

    return NextResponse.json({ success: true, message: "Schools fetched successfully", schools }, { status: 200 });

  } catch (error) {
    console.error("Fetch Schools Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
});