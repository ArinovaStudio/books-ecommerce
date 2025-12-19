import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";
import  z  from "zod";

const createKitValidation = z.object({
    classId: z.string().uuid("Invalid Class ID"),
    type: z.enum(["BASIC", "MEDIUM", "ADVANCE"]),
    items: z.array(
        z.object({
            productId: z.string().uuid("Invalid Product ID"),
            quantity: z.number().min(1, "Quantity must be at least 1")
        })
    ).min(1, "Kit must contain at least one item")
});

export const POST = Wrapper(async(req: NextRequest) => {
    try {
        const auth = await verifyAdmin(req);

        if (!auth.success){
            return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
        }

        if (auth.user.role !== "ADMIN") {
            return NextResponse.json({ success: false, message: "Only Super Admins can create kits" }, { status: 403 });
        }

        const body = await req.json();

        const validation = createKitValidation.safeParse(body);

        if (!validation.success) {
            const errors = validation.error.errors.map((error) => ({ field: error.path[0], message: error.message }));;
            return NextResponse.json({ success: false, message: "Vlidation error", errors }, { status: 400 });
        }

        const { classId, type, items } = validation.data;

        const existingKit = await prisma.kit.findFirst({ where: { classId, type }});

        if (existingKit) {
            return NextResponse.json({ success: false, message: "Kit already exists" }, { status: 400 });
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

        await prisma.$transaction(async tx => {
            const newKit = await tx.kit.create({ data: { classId, totalPrice, type } });

            await tx.kitItem.createMany({
                data: items.map(item => ({
                    kitId: newKit.id,
                    productId: item.productId,
                    quantity: item.quantity
                }))
            });
        });

        return NextResponse.json({ success: true, message: "Kit created successfully" }, { status: 200 });
    } catch (error) {
        console.error("Kit create error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
})