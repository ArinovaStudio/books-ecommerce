import { Wrapper } from "@/lib/api-handler"
import prisma from "@/lib/prisma"
import { verifyAdmin } from "@/lib/verify"
import { NextRequest, NextResponse } from "next/server"

export const GET = Wrapper(async (req: NextRequest) => {
  const auth = await verifyAdmin(req)
  if (!auth.success) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 }
    )
  }

  const { searchParams } = new URL(req.url)
  const classId = searchParams.get("classId")
  const name = searchParams.get("name")

  if (!classId || !name) {
    return NextResponse.json(
      { success: false, message: "classId and name are required" },
      { status: 400 }
    )
  }

  const section = await prisma.section.findFirst({
    where: {
      classId,
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      language: true,
    },
  })

  if (!section) {
    return NextResponse.json(
      { success: false, message: "Section not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    section,
  })
})
