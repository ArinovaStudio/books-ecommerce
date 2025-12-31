import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { Wrapper } from "@/lib/api-handler"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
interface JwtPayload {
    id: string
    email: string
    role: "ADMIN" | "SUB_ADMIN"
}
const SECRET_KEY = process.env.JWT_SECRET || "MY_SECRET_KEY"
export const GET = Wrapper(async (req: NextRequest): Promise<NextResponse> => {
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
    const user = await prisma.user.findFirst({
        where: { id: decoded.id },
        include: {
            school: true,
            children: true,
            orders: true,
        },
    })

    return NextResponse.json({ success: true, user: user })
})
