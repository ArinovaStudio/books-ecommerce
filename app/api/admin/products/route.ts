import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { getFullImageUrl, saveImage } from "@/lib/upload";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";

export const POST = Wrapper(async (req: NextRequest) => {
    try {
        const auth = await verifyAdmin(req);

        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
        }

        if (auth.user.role !== "ADMIN") {
            return NextResponse.json({ success: false, message: "Only Super Admins can create global products" }, { status: 403 });
        }

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const brand = formData.get("brand") as string;
        const price = formData.get("price") as string;
        const category = formData.get("category") as string;
        const stock = formData.get("stock") as string;
        const imageFile = formData.get("image") as File | null;
        const classId = formData.get("classId") as string;
        const schoolId = formData.get("schoolId") as string;
        if (!name || !description || !price || !category || !stock) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        let imageUrl = null;
        if (imageFile) {
            try {
                imageUrl = await saveImage(imageFile);
            } catch (error: any) {
                return NextResponse.json({ success: false, message: "Image upload failed", error: error.message }, { status: 400 });
            }
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                brand,
                category: category as "TEXTBOOK" | "NOTEBOOK" | "STATIONARY" | "OTHER",
                stock: parseInt(stock),
                image: imageUrl,
                classId: classId
            }
        });

        newProduct.image = getFullImageUrl(imageUrl as string, req);

        return NextResponse.json({ success: true, message: "Product added successfully", product: newProduct }, { status: 200 });

    } catch (error) {
        console.error("Product add error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
})

export async function GET(req: NextRequest) {
    try {
        const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to fetch products" }, { status: 500 });
    }
}