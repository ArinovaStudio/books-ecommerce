import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getFullImageUrl } from '@/lib/upload';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const classId = searchParams.get("classId");

        if (!classId) {
            return NextResponse.json({ success: false, message: "Class ID is required" }, { status: 400 });
        }

        const existingClass = await prisma.class.findUnique({ where: { id: classId } });

        if (!existingClass) {
            return NextResponse.json({ success: false, message: "Class not found" }, { status: 404 });
        }

        const kits = await prisma.kit.findMany({ where: { classId }, include: { items: { include: { product: true } } } });

        if (!kits || kits.length === 0) {
            return NextResponse.json({ success: false, message: "Kits not found" }, { status: 404 });
        }

        const formatKits = kits.map(kit => ({
            id: kit.id,
            type: kit.type,
            totalPrize: kit.totalPrice,
            items: kit.items.map(item => ({
                id: item.id,
                quantity: item.quantity,
                name: item.product.name,
                image: getFullImageUrl(item.product.image as string, req),
                price: item.product.price,
                description: item.product.description,
                stock: item.product.stock
            }))
        }));

        return NextResponse.json({ success: true, message: "Kits fetched successfully", kits: formatKits }, { status: 200 });
        
    } catch (error) {
        console.error("Kit fetch error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}