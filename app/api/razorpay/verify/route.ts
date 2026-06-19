// app\api\razorpay\verify\route.ts
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { customAlphabet } from "nanoid";
import { verifyUser } from "@/lib/verify";
import sendEmail from "@/lib/email";
import { mailTemplate } from "@/lib/mailTemplate";
import { sendToGoogleSheet } from "@/lib/google-sheet";

const generateOrderId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  12,
);

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyUser(req);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message || "Unauthorized" },
        { status: auth.status },
      );
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, orderPayload } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !orderPayload) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const {
      userId,
      childIds,
      validatedItems,
      serverTotal,
      phone,
      landmark,
      pincode,
    } = orderPayload;

    if (userId !== auth.user.id) {
      return NextResponse.json(
        { success: false, message: "User mismatch" },
        { status: 403 },
      );
    }

    // Prevent duplicate orders for the same Razorpay session
    const existingPayment = await prisma.payment.findFirst({
      where: { razorpayOrderId: razorpay_order_id },
    });
    if (existingPayment) {
      return NextResponse.json({ success: true, alreadyProcessed: true });
    }

    const student = await prisma.student.findUnique({
      where: { id: childIds[0] },
      include: { school: true, class: true, sectionDetails: true },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 },
      );
    }
    let createdOrder;
    await prisma.$transaction(async (tx) => {
      const orderId = generateOrderId();

      const order = await tx.order.create({
        data: {
          id: orderId,
          userId,
          students: {
            create: childIds.map((id: string) => ({
              student: { connect: { id } },
            })),
          },
          academicYear: student.class.academicYear,
          class: student.class.name,
          section: student.section,
          school: student.school.name,
          status: "ORDER_PLACED",
          totalAmount: serverTotal,
          phone,
          landmark,
          pincode,
        },
      });
      if (createdOrder) {
        sendToGoogleSheet({
          orderId: createdOrder.id,
          paymentId: razorpay_payment_id,
          parentName: student.name,
          parentEmail: student.parentEmail,
          phone,
          school: student.school.name,
          className: student.class.name,
          section: student.section,
          students: childIds.length,
          amount: serverTotal,
          landmark,
          pincode,
        }).catch(console.error);

        sendEmail("glownestserv@gmail.com", "A New Order Received", html).catch(
          console.error,
        );
      }
      const html = mailTemplate
        .replace("{{orderId}}", order.id)
        .replace("{{parentName}}", student.name)
        .replace("{{phone}}", phone)
        .replace("{{school}}", student.school.name)
        .replace("{{class}}", student.class.name)
        .replace("{{section}}", student.section)
        .replace("{{landmark}}", landmark)
        .replace("{{pincode}}", pincode)
        .replace("{{totalAmount}}", serverTotal.toString());

      await tx.orderItem.createMany({
        data: validatedItems.map((item: any) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      await tx.payment.create({
        data: {
          orderId: order.id,
          amount: serverTotal,
          method: "Razorpay",
          status: "SUCCESS",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
        },
      });
      await sendToGoogleSheet({
        orderId: order.id,
        paymentId: razorpay_payment_id,
        parentName: student.name,
        parentEmail: student.parentEmail,
        phone,
        school: student.school.name,
        className: student.class.name,
        section: student.section,
        students: childIds.length,
        amount: serverTotal,
        landmark,
        pincode,
      });
      await sendEmail("glownestserv@gmail.com", "A new order recevied", html);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Razorpay verify error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
