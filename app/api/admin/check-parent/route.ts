import { Wrapper } from "@/lib/api-handler"
import prisma from "@/lib/prisma"
import { verifyAdmin } from "@/lib/verify"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

const checkParentSchema = z.object({
    email: z.string().email("Invalid email format")
})

export const GET = Wrapper(async (req: NextRequest) => {
    try {
        const auth = await verifyAdmin(req)
        if (!auth.success) {
            return NextResponse.json(
                { success: false, message: auth.message || "Admin access required" },
                { status: auth.status }
            )
        }

        const { searchParams } = new URL(req.url)
        const email = searchParams.get("email")

        const validation = checkParentSchema.safeParse({ email })
        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Validation error",
                    errors: validation.error.errors.map(err => ({
                        field: err.path[0],
                        message: err.message
                    }))
                },
                { status: 400 }
            )
        }

        const parent = await prisma.user.findFirst({
            where: {
                email: validation.data.email,
                role: "USER"
            },
            select: {
                id: true
            }
        })

        return NextResponse.json(
            {
                success: true,
                exists: !!parent
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Check Parent Error:", error)
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        )
    }
})
