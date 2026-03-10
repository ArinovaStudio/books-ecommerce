import { NextResponse, NextRequest } from "next/server";
import { razorpay } from "@/lib/razorpay";
import prisma from "@/lib/prisma";
import { customAlphabet } from "nanoid";
import { verifyUser } from "@/lib/verify";
const generateOrderId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  12
);
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
    const userName = auth.user.name;
    const userEmail = auth.user.email;

    const {
      amount,
      studentId,
      items,
      paymentMethod,
      phone,
      landmark,
      pincode,
    } = await req.json();

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: true,
        school: {
          include: {
            subAdmins: {
              where: { role: "SUB_ADMIN", status: "ACTIVE" },
              select: { email: true, name: true },
            },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    if (student.parentId !== userId) {
      return NextResponse.json(
        { success: false, message: "This student does not belong to you" },
        { status: 403 }
      );
    }

    if (student.isActive === false) {
      return NextResponse.json(
        { success: false, message: "This student is inactive" },
        { status: 403 }
      );
    }

    // Validate Products & Calculate Total
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let totalAmount = 0;
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));
    const validOrderItems: {
      productId: string;
      quantity: number;
      price: number;
    }[] = [];
    const emailItems: { name: string; quantity: number; price: number }[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message: `Product ID ${item.productId} invalid or not found`,
          },
          { status: 400 }
        );
      }

      const lineTotal = product.price * item.quantity;
      totalAmount += lineTotal;

      validOrderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      emailItems.push({
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const razorPayOrder = await razorpay.orders.create({
      amount: amount * 100, // ₹ → paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });
    // Transaction
    const orderId = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          id: razorPayOrder.id,
          userId,
          studentId,
          school: student.school.name,
          class: student.class.name,
          section: student.section,
          academicYear: student.class.academicYear,
          status: "ORDER_PLACED",
          totalAmount: totalAmount,
          phone,
          landmark,
          pincode,
        },
      });

      if (validOrderItems.length > 0) {
        await tx.orderItem.createMany({
          data: validOrderItems.map((item) => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        });
      }

      await tx.payment.create({
        data: {
          id: razorPayOrder.id,
          orderId: razorPayOrder.id,
          amount: totalAmount,
          method: paymentMethod,
          status: "PENDING",
        },
      });

      return order.id;
    });
    return NextResponse.json({ success: true, order: razorPayOrder });
  } catch (error) {
    console.error("Razorpay order error", error);
    return NextResponse.json(
      { success: false, message: "Order creation failed" },
      { status: 500 }
    );
  }
}
