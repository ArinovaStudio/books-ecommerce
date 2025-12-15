import prisma from "@/lib/prisma";
import { getFullImageUrl } from "@/lib/upload";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { kitId: string } }) {
    try {
        const { kitId } = await params;

        if (!kitId) {
            return NextResponse.json({ success: false, message: "Kit ID is required" }, { status: 400 });
        }

        const kit = await prisma.kit.findUnique({ where: { id: kitId }, include: { items: { include: { product: true } } } });

        if (!kit) {
            return NextResponse.json({ success: false, message: "Kits not found" }, { status: 404 });
        }

        const formatKitItems = kit.items.map(item => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            name: item.product.name,
            image: getFullImageUrl(item.product.image as string, req),
            price: item.product.price,
            description: item.product.description,
            stock: item.product.stock
        }));

        return NextResponse.json({ success: true, message: "Kits fetched successfully", kit: { ...kit, items: formatKitItems } }, { status: 200 });
        
    } catch (error) {
        console.error("Kit fetch error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}