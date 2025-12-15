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
    )
});

export async function POST(req: NextRequest){
    try {
        const auth = await verifyAdmin(req);

        if (!auth.success){
            return NextResponse.json({ success: false, message: "Admin access required", status: 403 });
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

        const newKit = await prisma.kit.create({ data: { classId, totalPrice, type } });

        await prisma.kitItem.createMany({
            data: items.map(item => ({
                kitId: newKit.id,
                productId: item.productId,
                quantity: item.quantity
            }))
        });

        return NextResponse.json({ success: true, message: "Kit created successfully" }, { status: 200 });
    } catch (error) {
        console.error("Kit create error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}