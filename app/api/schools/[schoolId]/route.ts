import prisma from "@/lib/prisma";
import { getFullImageUrl } from "@/lib/upload";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { schoolId: string } }) {
  try {
    const { schoolId } = await params;

    if (!schoolId) {
      return NextResponse.json({ success: false, message: "School ID is required" }, { status: 400 });
    }

    const school = await prisma.school.findUnique({ where: { id: schoolId }, include: { classes: true } });

    if (!school) {
      return NextResponse.json({ success: false, message: "School not found" }, { status: 404 });
    }

    if (school.image){
        school.image = getFullImageUrl(school.image, req);
    }

    return NextResponse.json({ success: true, message: "School found", school }, { status: 200 });

  } catch (error) {
    console.error("Get School Detail Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}