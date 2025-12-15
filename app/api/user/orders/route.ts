import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyUser } from "@/lib/verify";

const createOrderValidation = z.object({
  kitId: z.string().uuid(),
  paymentMethod: z.string().min(1, "Payment method is required"),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().min(1)
    })
  ).min(1, "Order must contain at least one item")
});

export async function POST(req: NextRequest) {
  try {

    const auth = await verifyUser(req);

    if (!auth.success) {
        return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
    }

    const userId = auth.user.id;

    const body = await req.json();
    
    const validation = createOrderValidation.safeParse(body);

    if (!validation.success) {
        const errors = validation.error.errors.map((error) => ({ field: error.path[0], message: error.message }));;
        return NextResponse.json({ success: false, message: "Vlidation error", errors }, { status: 400 });
    }

    const { kitId, items, paymentMethod } = validation.data;

    const kit = await prisma.kit.findUnique({ where: { id: kitId }, include: { class: { include: { school: true } }}});

    if (!kit) {
      return NextResponse.json({ success: false, message: "Kit not found" }, { status: 404 });
    }

    const productIds = items.map(i => i.productId);
    const dbProducts = await prisma.product.findMany({ where: { id: { in: productIds } }});

    let totalAmount = 0;
    const productMap = new Map(dbProducts.map(p => [p.id, p]));

    const validOrderItems: { productId: string, quantity: number }[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json({ success: false, message: `Product ID ${item.productId} invalid` }, { status: 400 });
      }
      
      totalAmount += product.price * item.quantity;

      validOrderItems.push({ productId: item.productId, quantity: item.quantity });
    }

    // Create Order
    const order = await prisma.order.create({
        data: {
            userId,
            school: kit.class.school.name, 
            class: kit.class.name,       
            kitType: kit.type,        
            status: "Ordered",                
        }
    });

    // Create Order Items
    await prisma.orderItem.createMany({
        data: validOrderItems.map(item => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity
        }))
    });

    // Payment history added
    await prisma.payment.create({
        data: {
            orderId: order.id,
            amount: totalAmount,
            method: paymentMethod,
            status: "PENDING"
        }
    });

    return NextResponse.json({ success: true, message: "Order created successfully", orderId: order.id }, { status: 201 });

  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyUser(req);

    if (!auth.success) {
        return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
    }

    const userId = auth.user.id;

    const orders = await prisma.order.findMany({ where: { userId }, include: { payment: { select: { amount: true, status: true, method: true }},
    items: { include: { product: { select: { name: true, image: true, price: true } }}}}, orderBy: { createdAt: "desc" } });

    return NextResponse.json({ success: true, orders }, { status: 200 });

  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}