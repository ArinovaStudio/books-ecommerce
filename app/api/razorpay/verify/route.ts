import prisma from "@/lib/prisma";
import { newOrderAlertTemplate, orderReceiptTemplate } from "@/lib/templates";
import { verifyUser } from "@/lib/verify";
import crypto from "crypto";
import { NextResponse, NextRequest } from "next/server";
import sendEmail from "@/lib/email";

const secret = process.env.RAZORPAY_KEY_SECRET!;
export async function POST(req: NextRequest) {
  const body = await req.json();
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
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
    childIds,
    paymentId,
  } = body;

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");
  const childsInfo = [];
  for (let childId of childIds) {
    const student = await prisma.student.findUnique({
      where: { id: childId },
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
    childsInfo.push(student.name);
  }
  const student = await prisma.student.findUnique({
    where: {
      id: childIds[0],
    },
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
  if (!student) throw Error("No Children Found!");
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: true,
      payment: true,
    },
  });
  if (!order) {
    return NextResponse.json(
      { success: false, message: "Order Not Found!" },
      { status: 403 }
    );
  }
  if (generatedSignature === razorpay_signature) {
    const items = order.items;
    // Validate Products & Calculate Total
    const productIds = items.map((i) => i.productId);
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

    // Transaction
    await prisma.payment.update({
      where: {
        id: paymentId,
        orderId: order.id,
      },
      data: {
        method: "Razorpay",
        status: "SUCCESS",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    });
    // send mails to parent
    const userEmailData = orderReceiptTemplate(
      userName,
      order.id,
      childsInfo,
      student.class.name,
      student.school.name,
      student.section,
      totalAmount,
      emailItems
    );
    await sendEmail(userEmail, userEmailData.subject, userEmailData.html).catch(
      (err) => console.error("User email failed", err)
    );

    // send mail to sub admins
    if (student.school.subAdmins.length > 0) {
      student.school.subAdmins.forEach((admin, index) => {
        const adminEmailData = newOrderAlertTemplate(
          admin.name,
          student.school.name,
          order.id,
          student.name,
          `${student.class.name} - ${student.section}`,
          totalAmount
        );
        sendEmail(
          admin.email,
          adminEmailData.subject,
          adminEmailData.html
        ).catch((err) => console.error("Admin notification failed", err));
      });
    }

    // send mail to all admins
    const systemAdmins = await prisma.user.findMany({
      where: { role: "ADMIN", status: "ACTIVE" },
      select: { email: true, name: true },
    });

    if (systemAdmins.length > 0) {
       await Promise.all(
        student.school.subAdmins.map(async (admin) => {
          console.log("Admin", admin);
          const adminEmailData = newOrderAlertTemplate(
            admin.name,
            student.school.name,
            order.id,
            student.name,
            `${student.class.name} - ${student.section}`,
            totalAmount
          );
          await sendEmail(admin.email, adminEmailData.subject, adminEmailData.html).catch(
            (err) => console.error("Admin notification failed", err)
          );
        })
      );
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 400 });
}
