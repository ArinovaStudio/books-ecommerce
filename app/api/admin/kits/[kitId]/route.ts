import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const updateKitValidation = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid("Invalid Product ID"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })
  ).min(1, "Kit must contain at least one item"),
});

export const PUT = Wrapper(async( req: NextRequest, { params }: { params: Promise<{ kitId: string }> }) => {
  try {
    const auth = await verifyAdmin(req);
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message || "Admin access required" }, { status: 403 });
    }

    if (auth.user.role !== "ADMIN") {
        return NextResponse.json({ success: false, message: "Only Super Admins can update kits" }, { status: 403 });
    }

    const { kitId } = await params;
    if (!kitId) {
      return NextResponse.json({ success: false, message: "Kit ID is required" }, { status: 400 });
    }

    const body = await req.json();

    const validation = updateKitValidation.safeParse(body);
    
    if (!validation.success) {
        const errors = validation.error.errors.map((error) => ({ field: error.path[0], message: error.message }));;
        return NextResponse.json({ success: false, message: "Vlidation error", errors }, { status: 400 });
    }

    const { items } = validation.data;

    const existingKit = await prisma.kit.findUnique({ where: { id: kitId } });

    if (!existingKit) {
      return NextResponse.json({ success: false, message: "Kit not found" }, { status: 404 });
    }

    const productIds = items.map((item) => item.productId);

    const existingProducts = await prisma.product.findMany({ where: { id: { in: productIds } } });

    let totalPrice = 0;
    const productMap = new Map(existingProducts.map((product) => [product.id, product.price]));

    for (const item of items){
        const price = productMap.get(item.productId);
        if (!price){
            return NextResponse.json({ success: false, message: `Product ID ${item.productId} not found` }, { status: 404 });
        }
        totalPrice += price * item.quantity;
    }


    await prisma.kit.update({ where: { id: kitId }, data: { totalPrice } });

    await prisma.kitItem.deleteMany({ where: { kitId: kitId } });

    await prisma.kitItem.createMany({
        data: items.map((item) => ({
            kitId: kitId,
            productId: item.productId,
            quantity: item.quantity,
        })),
    });

    return NextResponse.json({ success: true, message: "Kit updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Kit update error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
})

export const DELETE = Wrapper(async(req: NextRequest, { params }: { params: Promise<{ kitId: string }> }) => {
    try {
        const auth = await verifyAdmin(req);

        if (!auth.success){
            return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
        }

        if (auth.user.role !== "ADMIN") {
            return NextResponse.json({ success: false, message: "Only Super Admins can delete kits" }, { status: 403 });
        }

        const { kitId } = await params;

        if (!kitId){
            return NextResponse.json({ success: false, message: "Kit ID is required" }, { status: 400 });
        }

        const existingKit = await prisma.kit.findUnique({ where: { id: kitId }});

        if (!existingKit){
            return NextResponse.json({ success: false, message: "Kit not found" }, { status: 404 });
        }

        await prisma.kitItem.deleteMany({ where: { kitId } });

        await prisma.kit.delete({ where: { id: kitId }});
        
        return NextResponse.json({ success: true, message: "Kit deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Kit delete error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
})