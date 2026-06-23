import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const searchParam = req.nextUrl.searchParams
    const userId = searchParam.get("userId")

    if (!userId) {
        return NextResponse.json({data: "User ID is not provided"}, {status: 400})
    }
    

    const orders = await prisma.order.findMany({
        where: {
            user: {
                email: userId
            }
        }
    })

    return NextResponse.json({data: orders}, {status: 200})
}