import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { schoolId, classId, sectionName } = await req.json();
  if (schoolId === "" || classId === "") {
    return NextResponse.json({
      success: false,
      message: "School Id Or class id is not present",
    });
  }
  try {
    if (!sectionName) {
      const products = await prisma.product.findMany({
        where: {
          classId: classId,
          class: {
            schoolId: schoolId,
          },
        },
        include: {
          class: true, // 👈 include related class
        },
        orderBy: {
          name: "asc",
        },
      });
      return NextResponse.json({ success: true, data: products });
    }
    const section = await prisma.section.findFirst({
      where: { classId: classId, name: sectionName },
    });
const products = await prisma.product.findMany({
  where: {
    classId: classId,
    class: {
      schoolId: schoolId,
    },
    OR: [
    {
      category: "TEXTBOOK",
      OR: [
        { language: "ALL" },
        { language: section?.language },
      ],
    },
    {
      category: {
        not: "TEXTBOOK",
      },
    },
  ],
  },
  include: {
    class: true,
  },
  orderBy: { name: "asc" },
});

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
