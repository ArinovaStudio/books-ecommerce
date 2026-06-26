// app/api/razorpay/verify/route.ts
import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { customAlphabet } from "nanoid";
import { verifyUser } from "@/lib/verify";
import sendEmail from "@/lib/email";
import { emailTemplate, mailTemplate } from "@/lib/mailTemplate";
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
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderPayload,
    } = body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderPayload
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // ---- 1. Verify the HMAC signature Razorpay generated for this payment ----
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 },
      );
    }

    // ---- 2. Confirm directly with Razorpay that it was actually captured ----
    const razorpayAuth = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`,
    ).toString("base64");

    const paymentRes = await fetch(
      `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
      { headers: { Authorization: `Basic ${razorpayAuth}` } },
    );

    if (!paymentRes.ok) {
      return NextResponse.json(
        { success: false, message: "Could not verify payment with Razorpay" },
        { status: 502 },
      );
    }

    const paymentDetails = await paymentRes.json();

    if (
      paymentDetails.status !== "captured" ||
      paymentDetails.order_id !== razorpay_order_id
    ) {
      return NextResponse.json(
        { success: false, message: "Payment not successful" },
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

    const orderId = generateOrderId();

    await prisma.order.create({
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
        items: {
          createMany: { 
            data: validatedItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        }
        },
        payment: {
          create: {
            amount: serverTotal,
            method: "Razorpay",
            status: "SUCCESS",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
          },
        },
      },
    });

    const html = mailTemplate
      .replace("{{orderId}}", orderId)
      .replace("{{parentName}}", student.name)
      .replace("{{phone}}", phone)
      .replace("{{school}}", student.school.name)
      .replace("{{class}}", student.class.name)
      .replace("{{section}}", student.section)
      .replace("{{landmark}}", landmark)
      .replace("{{pincode}}", pincode)
      .replace("{{totalAmount}}", serverTotal.toString());

    const userHtml = emailTemplate
      .replace(/{{CUSTOMER_NAME}}/g, student.name)
      .replace(/{{ORDER_ID}}/g, orderId)
      .replace(/{{AMOUNT}}/g, serverTotal);

    try {
      await sendToGoogleSheet({
        orderId: orderId,
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
    } catch (err) {
      console.error("Google Sheet failed", err);
    }

    try {
      await sendEmail("glownestserv@gmail.com", "A new order recevied", html);
    } catch (err) {
      console.error("Admin email failed", err);
    }

    try {
      await sendEmail(
        student.parentEmail,
        "Glow Nest - We have recevied your order",
        userHtml,
      );
    } catch (err) {
      console.error("Customer email failed", err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Razorpay verify error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
