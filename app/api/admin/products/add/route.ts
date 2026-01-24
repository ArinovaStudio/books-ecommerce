import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { getFullImageUrl, saveImage } from "@/lib/upload";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";

export const POST = Wrapper(async (req: NextRequest) => {
  try {
    const {
      name,
      description,
      brand,
      price,
      category,
      stock,
      preview,
      classId,
      schoolId,
    } = await req.json();

    if (!name || !description || !price || !category || !stock) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }
    // await new Promise((resolve)=>setTimeout(resolve,1000));
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        brand,
        category: category as "TEXTBOOK" | "NOTEBOOK",
        stock: parseInt(stock),
        image: preview,
        classId: classId,
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "Product added successfully",
        product: newProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Product add error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
});
