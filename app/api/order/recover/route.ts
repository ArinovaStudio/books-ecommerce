import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust this import to your prisma client path

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      userId,
      students,
      academicYear,
      class: className,
      section,
      school,
      status,
      totalAmount,
      phone,
      landmark,
      pincode,
      items,
      payment,
    } = body;

    // Validate required fields
    if (!id || !userId || !items || !payment) {
      return NextResponse.json(
        { error: "Missing required fields: id, userId, items, payment" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        id,
        userId,
        academicYear,
        class: className,
        section,
        school,
        status,
        totalAmount,
        phone,
        landmark,
        pincode,
        students: {
          create: students.map((s: { studentId: string }) => ({
            student: {
              connect: { id: s.studentId },
            },
          })),
        },
        items: {
          createMany: {
            // orderId is NOT passed here — Prisma infers it from the parent
            data: items.map((item: { productId: string; quantity: number; price: number }) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        payment: {
          create: {
            amount: payment.amount,
            method: payment.method,
            status: payment.status,
            razorpayOrderId: payment.razorpayOrderId,
            razorpayPaymentId: payment.razorpayPaymentId,
          },
        },
      },
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: unknown) {
    console.error("Manual order insert error:", error);
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}