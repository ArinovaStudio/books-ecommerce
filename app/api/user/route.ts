import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { Wrapper } from "@/lib/api-handler"

type PromoteBody = {
    userId: string
}

export const GET = Wrapper(async (req: NextRequest): Promise<NextResponse> => {
    const { searchParams } = new URL(req.url)
    const q: string | null = searchParams.get("q")

    if (!q || q.length < 2) {
        return NextResponse.json([])
    }

    const users = await prisma.user.findMany({
        where: {
            email: {
                contains: q,
                mode: "insensitive",
            },
            role: {
                not: "ADMIN",
            },
        },
        take: 5,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    })

    return NextResponse.json(users)
})


export const PATCH = Wrapper(async (req: NextRequest): Promise<NextResponse> => {
    const { userId } = (await req.json()) as PromoteBody

    if (!userId) {
        return NextResponse.json(
            { message: "User ID is required" },
            { status: 400 }
        )
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    })

    if (!user) {
        return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
        )
    }

    if (user.role === "ADMIN") {
        return NextResponse.json(
            { message: "User is already an admin" },
            { status: 400 }
        )
    }

    await prisma.user.update({
        where: { id: userId },
        data: { role: "ADMIN" },
    })

    return NextResponse.json({
        message: "User promoted to ADMIN",
    })
})
