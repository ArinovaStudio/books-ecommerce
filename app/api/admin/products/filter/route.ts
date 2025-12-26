import prisma from "@/lib/prisma";
import { getFullImageUrl } from "@/lib/upload";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {;
        const { schoolId, classId, language} = await req.json();

        if (!schoolId || !classId || !language) {
            return NextResponse.json({ success: false, message: "School ID, Class ID, and Language are required" }, { status: 400 });
        }

        const products = await prisma.product.findMany({ where: { schoolId, classId, language }, orderBy: { name: 'asc' } });

        const productsWithImages = products.map(p => ({
            ...p,
            image: p.image ? getFullImageUrl(p.image, req) : null
        }));

        return NextResponse.json({ success: true, data: productsWithImages });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to fetch products" }, { status: 500 });
    }
}