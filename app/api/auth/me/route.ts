import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { Wrapper } from "@/lib/api-handler"

const SECRET_KEY = process.env.JWT_SECRET || "MY_SECRET_KEY"

interface JwtPayload {
    id: string
    role: "ADMIN" | "SUB_ADMIN" | "USER"
}

export const GET = Wrapper(async (_req: NextRequest) => {
    try {
        const token = (await cookies()).get("token")?.value

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            )
        }

        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload

        /* ================= USER ================= */
        if (decoded.role === "USER") {
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                include: {
                    children: {
                        include: {
                            school: {
                                select: { name: true },
                            },
                            class: {
                                select: { name: true },
                            },
                        },
                    },
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
                    { success: false, message: `Account is ${user.status}` },
                    { status: 403 }
                )
            }

            /* 🔥 MAP TO FRONTEND SHAPE */
            const userData = {
                name: user.name,
                email: user.email,
                phone: user.phone ?? null,
                address: user.address ?? null,
                role: user.role,
                status: user.status,
                children: user.children.map((child) => ({
                    id: child.id,
                    name: child.name,
                    school: child.school.name,
                    rollNo: child.rollNo,
                    section: child.section,
                    dob: child.dob ? child.dob.toISOString() : null,
                    gender: child.gender ?? null,
                    bloodGroup: child.bloodGroup ?? null,
                    class: {
                        name: child.class.name,
                    },
                })),
            }

            return NextResponse.json(
                { success: true, user: userData },
                { status: 200 }
            )
        }

        /* ================= ADMIN / SUB_ADMIN ================= */
        const admin = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                school:
                    decoded.role === "SUB_ADMIN"
                        ? {
                            select: {
                                id: true,
                                name: true,
                            },
                        }
                        : false,
            },
        })

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { success: true, user: admin },
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
