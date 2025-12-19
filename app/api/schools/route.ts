import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { getFullImageUrl } from "@/lib/upload";
import { NextRequest, NextResponse } from "next/server";

export const GET = Wrapper(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    let query = {};

    if (search) {
      query = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { board: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const schools = await prisma.school.findMany({ where: query, orderBy: { createdAt: "desc" } });

    if (!schools || schools.length === 0) {
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
})