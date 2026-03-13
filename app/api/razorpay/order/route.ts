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

    const { amount, childIds, items, paymentMethod, phone, landmark, pincode } =
      await req.json();
    if (!childIds || childIds.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No Valid Child Id's were passed!",
      });
    }
    for (let childId of childIds) {
      const student = await prisma.student.findUnique({
        where: {
          id: childId,
        },
      });
      if (!student) throw Error(`Student with id ${childId} Not Found!`);
      if (student.parentId !== userId) {
        return NextResponse.json(
          {
            success: false,
            message: `student with id ${childId} does not belong to you`,
          },
          { status: 403 }
        );
      }

      if (student.isActive === false) {
        return NextResponse.json(
          { success: false, message: `student: ${student.name} is inactive` },
          { status: 403 }
        );
      }
    }

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

      const lineTotal = product.price * (item.quantity * childIds.length);
      totalAmount += lineTotal;

      validOrderItems.push({
        productId: item.productId,
        quantity: item.quantity * childIds.length,
        price: product.price,
      });
    }

    const razorPayOrder = await razorpay.orders.create({
      amount: amount * 100, // ₹ → paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });
    const student = await prisma.student.findUnique({
      where: {
        id: childIds[0],
      },
      include: {
        school: true,
        class: true,
        sectionDetails: true,
      },
    });
    // Transaction
    const OrderPaymentInfo = await prisma.$transaction(async (tx) => {
      const ordId = generateOrderId();
      console.log(ordId);
      const childIdsQuery = childIds.map((id: string) => {
        return {
          student: {
            connect: {
              id: id,
            },
          },
        };
      });
      const order = await tx.order.create({
        data: {
          id: ordId,
          userId,
          students: {
            create: childIdsQuery,
          },
          academicYear: student!.class.academicYear,
          class: student!.class.name,
          section: student!.section,
          school: student!.school.name,
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

      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          amount: totalAmount,
          method: paymentMethod,
          status: "PENDING",
        },
      });

      return { orderId: order.id, paymentId: payment.id };
    });
    return NextResponse.json({
      success: true,
      order: { ...razorPayOrder, ...OrderPaymentInfo },
    });
  } catch (error) {
    console.error("Razorpay order error", error);
    return NextResponse.json(
      { success: false, message: "Order creation failed" },
      { status: 500 }
    );
  }
}
