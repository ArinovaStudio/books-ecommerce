import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { getFullImageUrl, saveImage } from "@/lib/upload";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";
import { ProductCategory } from "@prisma/client";

export const POST = Wrapper(async (req: NextRequest) => {
    try {
        const auth = await verifyAdmin(req);

        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
        }

        if (auth.user.role !== "ADMIN" && auth.user.role !== "SUB_ADMIN") {
             return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 });
        }

        const formData = await req.formData();
    
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const brand = formData.get("brand") as string;
        const price = formData.get("price") as string;
        const category = formData.get("category") as string;
        const stock = formData.get("stock") as string;  // optional field to track product stock
        const type = formData.get("type") as string; 
        const imageFile = formData.get("image") as File | null;
        const schoolId = formData.get("schoolId") as string; 
        const classId = formData.get("classId") as string;
        const language = formData.get("language") as string;
        const quantity = formData.get("quantity") as string;

        if (!name || !description || !price || !category || !schoolId || !classId || !language) {
            return NextResponse.json({ success: false, message: "All required fields must be provided." }, { status: 400 });
        }

        if (auth.user.role === "SUB_ADMIN" && auth.user.schoolId !== schoolId) {
            return NextResponse.json({ success: false, message: "You can only add products to your own school" }, { status: 403 });
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
                brand: brand || null,
                category: category as ProductCategory,
                stock: parseInt(stock),
                type: type || null,
                image: imageUrl,
                schoolId: schoolId,
                classId: classId,
                language: language,
                quantity: quantity ? parseInt(quantity) : 1 
            }
        });

        if (newProduct.image) {
            newProduct.image = getFullImageUrl(newProduct.image, req);
        }

        return NextResponse.json({ success: true, message: "Product added successfully to the class", product: newProduct }, { status: 200 });

    } catch (error) {
        console.error("Product add error:", error); 
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
})