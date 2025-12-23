import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { Wrapper } from "@/lib/api-handler"

const SECRET_KEY = process.env.JWT_SECRET || "MY_SECRET_KEY"

interface JwtPayload {
    id: string
    email: string
    role: "ADMIN" | "SUB_ADMIN"
}

export const GET = Wrapper(async (_req: NextRequest) => {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            )
        }

        let decoded: JwtPayload
        try {
            decoded = jwt.verify(token, SECRET_KEY) as JwtPayload
        } catch {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,

                // ONLY FETCH SCHOOL FOR SUB_ADMIN
                school: decoded.role === "SUB_ADMIN"
                    ? {
                        select: {
                            id: true,
                            name: true,
                        },
                    }
                    : false,
            },
        })

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            )
        }

        if (user.status !== "ACTIVE") {
            return NextResponse.json(
                {
                    success: false,
                    message: `Account is ${user.status.toLowerCase()}`,
                },
                { status: 403 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                user,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Auth Me Error:", error)
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        )
    }
})
