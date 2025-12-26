import prisma from "@/lib/prisma";
import { deleteImage, getFullImageUrl, saveImage } from "@/lib/upload";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";
import { Wrapper } from '@/lib/api-handler';
import { ProductCategory } from "@prisma/client";

export const PUT = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ productId: string }> }) => {
    try {
        const auth = await verifyAdmin(req);

        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
        }

        const { productId } = await params;

        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
        }

        const existingProduct = await prisma.product.findUnique({ where: { id: productId } });

        if (!existingProduct) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        const isAdmin = auth.user.role === "ADMIN";
        const isSubAdmin = auth.user.role === "SUB_ADMIN" && auth.user.schoolId === existingProduct.schoolId;

        if (!isAdmin && !isSubAdmin) {
            return NextResponse.json({ success: false, message: "You are not authorized to delete this product" }, { status: 403 });
        }

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const price = formData.get("price") as string;
        const category = formData.get("category") as string;
        const stock = formData.get("stock") as string;
        const quantity = formData.get("quantity") as string; 
        const language = formData.get("language") as string; 
        const imageFile = formData.get("image") as File | null;

        if (!name || !description || !price || !category) {
            return NextResponse.json({ success: false, message: "Name, Description, Price, Category and Stock are required" }, { status: 400 });
        }

        let imageUrl = existingProduct.image;
        if (imageFile && imageFile.size > 0) {
            const newImageUrl = await saveImage(imageFile);

            if (existingProduct.image) {
                await deleteImage(existingProduct.image);
            }

            imageUrl = newImageUrl;
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId }, 
            data: {
                name,
                description,
                price: parseFloat(price),
                category: category as ProductCategory,
                stock: parseInt(stock),
                quantity: quantity ? parseInt(quantity) : existingProduct.quantity,
                language: language || existingProduct.language,
                image: imageUrl
            }
        });

        updatedProduct.image = getFullImageUrl(updatedProduct.image as string, req);

        return NextResponse.json({ success: true, message: "Product updated successfully", product: updatedProduct }, { status: 200 });
    } catch (error) {
        console.error("Product update error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
})

export const DELETE = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ productId: string }> }) => {
    try {
        const auth = await verifyAdmin(req);

        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
        }

        const { productId } = await params;

        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
        }

        const existingProduct = await prisma.product.findUnique({ where: { id: productId } });

        if (!existingProduct) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        const isAdmin = auth.user.role === "ADMIN";
        const isSubAdmin = auth.user.role === "SUB_ADMIN" && auth.user.schoolId === existingProduct.schoolId;

        if (!isAdmin && !isSubAdmin) {
            return NextResponse.json({ success: false, message: "You are not authorized to delete this product" }, { status: 403 });
        }

        if (existingProduct.image) {
            await deleteImage(existingProduct.image);
        }

        await prisma.product.delete({ where: { id: productId } });

        return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Product delete error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
})