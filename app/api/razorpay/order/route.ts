// app/api/razorpay/order/route.ts
import { NextResponse, NextRequest } from "next/server";
import { razorpay } from "@/lib/razorpay";
import prisma from "@/lib/prisma";
import { verifyUser } from "@/lib/verify";
import z from "zod";

const orderSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  childIds: z.array(z.string()).min(1, "No valid child IDs were passed"),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "Cart is empty"),
  phone: z.string().regex(/^[0-9]{10}$/, "Invalid 10-digit phone number"),
  landmark: z.string().min(1, "Landmark is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Invalid 6-digit pincode"),
});

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyUser(req);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message || "Unauthorized" },
        { status: auth.status }
      );
    }

    const userId = auth.user.id;
    const body = await req.json();
    const validation = orderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { amount, childIds, items, phone, landmark, pincode } =
      validation.data;

    // ── 1. Verify every child belongs to this user and is active ──────────
    for (const childId of childIds) {
      const student = await prisma.student.findUnique({
        where: { id: childId },
      });
      if (!student) {
        return NextResponse.json(
          { success: false, message: `Student ${childId} not found` },
          { status: 404 }
        );
      }
      if (student.parentId !== userId) {
        return NextResponse.json(
          { success: false, message: `Student ${childId} does not belong to you` },
          { status: 403 }
        );
      }
      if (!student.isActive) {
        return NextResponse.json(
          { success: false, message: `Student ${student.name} is inactive` },
          { status: 403 }
        );
      }
    }

    // ── 2. Validate products and compute server-side total ─────────────────
    const productIds = items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let serverTotal = 0;
    const validatedItems: { productId: string; quantity: number; price: number }[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }
      const qty = item.quantity * childIds.length;
      serverTotal += product.price * qty;
      validatedItems.push({ productId: item.productId, quantity: qty, price: product.price });
    }

    // Guard against client-side amount tampering
    if (Math.round(serverTotal * 100) !== Math.round(amount * 100)) {
      return NextResponse.json(
        { success: false, message: "Amount mismatch — please refresh and try again" },
        { status: 400 }
      );
    }

    // ── 3. Create Razorpay session ONLY — no DB writes ────────────────────
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(serverTotal * 100), // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    // Return the Razorpay session + pre-validated payload so the verify
    // endpoint doesn't need to re-query products or re-check children.
    return NextResponse.json({
      success: true,
      razorpayOrder,
      // Signed/trusted on the server — client passes this back verbatim
      orderPayload: {
        userId,
        childIds,
        validatedItems,
        serverTotal,
        phone,
        landmark,
        pincode,
      },
    });
  } catch (error) {
    console.error("Razorpay order error", error);
    return NextResponse.json(
      { success: false, message: "Failed to create payment session" },
      { status: 500 }
    );
  }
}