import prisma from "@/lib/prisma";
import { deleteImage, getFullImageUrl, saveImage } from "@/lib/upload";
import { verifyAdmin } from "@/lib/verify-admin";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { productId: string } }){
    try {
        const auth = await verifyAdmin(req);
                
        if (!auth.success){
            return NextResponse.json({ success: false, message: "Admin access required", status: 403 });
        }

        const { productId } = await params;

        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
        }

        const existingProduct = await prisma.product.findUnique({ where: { id: productId } });

        if (!existingProduct) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const price = formData.get("price") as string;
        const category = formData.get("category") as string;
        const stock = formData.get("stock") as string;
        const imageFile = formData.get("image") as File | null;

        if (!name || !description || !price || !category || !stock) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        let imageUrl = existingProduct.image;
        if (imageFile) {
            const newImageUrl = await saveImage(imageFile);

            if (existingProduct.image){
                await deleteImage(existingProduct.image);
            }

            imageUrl = newImageUrl;
        }

        const updatedProduct = await prisma.product.update({ where: { id: productId }, data: { 
                name, 
                description, 
                price: parseFloat(price), 
                category: category as "BOOK" | "STATIONARY" | "OTHER", 
                stock: parseInt(stock), 
                image: imageUrl 
        }});

        updatedProduct.image = getFullImageUrl(updatedProduct.image as string, req);

        return NextResponse.json({ success: true, message: "Product updated successfully", product: updatedProduct }, { status: 200 });
    } catch (error) {
        console.error("Product update error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { productId: string } }){
    try {
        const auth = await verifyAdmin(req);
                
        if (!auth.success){
            return NextResponse.json({ success: false, message: "Admin access required", status: 403 });
        }

        const { productId } = await params;

        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
        }

        const existingProduct = await prisma.product.findUnique({ where: { id: productId } });

        if (!existingProduct) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        if (existingProduct.image){
            await deleteImage(existingProduct.image);
        }

        await prisma.product.delete({ where: { id: productId } });

        return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Product delete error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}