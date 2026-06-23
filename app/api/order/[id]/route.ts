import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest,  { params }: { params: Promise<{ id: string }> }) {
    const {id} = await params
    const orders = await prisma.order.findMany({
        where: {id: id}
    })

    return NextResponse.json({data: orders}, {status: 200})
}