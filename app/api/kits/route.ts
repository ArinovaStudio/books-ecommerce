import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getFullImageUrl } from '@/lib/upload';
import { Wrapper } from "@/lib/api-handler";

export const GET = Wrapper(async(req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const classId = searchParams.get("classId");
        const language = searchParams.get("language");

        if (!classId || !language) {
            return NextResponse.json( { success: false, message: "Class ID and Language are required" },{ status: 400 });
        }

        const exisitinClass = await prisma.class.findUnique({ where: { id: classId } });

        if (!exisitinClass) {
            return NextResponse.json({ success: false, message: "Class not found" }, { status: 404 });
        }

        const kits = await prisma.kit.findMany({
        where: {
            classId: classId,
            language: language,
        },
        include: {
            items: {
            include: {
                product: true, 
            },
            },
        },
        });

        const formattedKits = kits.map((kit) => ({
        id: kit.id,
        title: formatTitle(kit.type),
        offeredPrice: kit.totalPrice,
        type: kit.type, 
        isPopular: kit.type === "MEDIUM",
        items: kit.items.map((item) => ({
            id: item.productId,
            name: item.product.name,
            qty: item.quantity,
            price: item.product.price,
        })),
        }));

        return NextResponse.json({ success: true, message: "Kits fetched successfully", kits: formattedKits }, { status: 200 });
        
    } catch (error) {
        console.error("Kit fetch error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
})

function formatTitle(type: string) {
  const map: Record<string, string> = {
    BASIC: "Basic Bundle",
    MEDIUM: "Standard Bundle",
    ADVANCE: "Premium Bundle",
  };
  return map[type] || type;
}