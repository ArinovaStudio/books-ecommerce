import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyUser } from "@/lib/verify";
import { Wrapper } from "@/lib/api-handler";
import sendEmail from "@/lib/email";
import { statusTemplate } from "@/lib/mailTemplate";

const validationSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    "ORDER_PLACED",
    "PACKAGING_DONE",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ]),
});

const OrderStatus = {
  ORDER_PLACED: "ORDER_PLACED",
  PACKAGING_DONE: "PACKAGING_DONE",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
};

const STATUS_INDEX = {
    ORDER_PLACED: 0,
    PACKAGING_DONE: 1,
    OUT_FOR_DELIVERY: 2,
    DELIVERED: 3,
  };

function getSubject(orderId: string, orderStatus: string) {
  const map = {
    [OrderStatus.PACKAGING_DONE]: `Glow Nest - Your order #${orderId} is being packed 📦`,
    [OrderStatus.OUT_FOR_DELIVERY]: `Glow Nest - Your order #${orderId} is out for delivery 🚚`,
    [OrderStatus.DELIVERED]: `Glow Nest - Your order #${orderId} has been delivered! 🎉`,
  };
  return map[orderStatus] || `Update on your order #${orderId}`;
}

function buildTrackerHtml(orderStatus: keyof typeof STATUS_INDEX) {


  const STEPS = [
    "Order Placed",
    "Packaging Done",
    "Out for Delivery",
    "Delivered",
  ];

  const activeIndex = STATUS_INDEX[orderStatus];

  if (activeIndex === undefined) {
    throw new Error(`Unknown OrderStatus: "${orderStatus}"`);
  }

  const items = STEPS.map((label, i) => {
    let dotClass, lineClass, nameClass, badge;

    if (i < activeIndex) {
      // already completed
      dotClass = "done";
      lineClass = "filled";
      nameClass = "done";
      badge = "";
    } else if (i === activeIndex) {
      // current step
      dotClass = "active";
      lineClass = "";
      nameClass = "active";
      badge = '<span class="step-badge">In Progress</span>';
    } else {
      // not reached yet
      dotClass = "pending";
      lineClass = "";
      nameClass = "";
      badge = "";
    }

    const isLast = i === STEPS.length - 1;

    return `
      <li class="step">
        <div class="step-left">
          <div class="step-dot ${dotClass}"></div>
          ${!isLast ? `<div class="step-line ${lineClass}"></div>` : ""}
        </div>
        <div class="step-content">
          <div class="step-name ${nameClass}">${label}</div>
          ${badge}
        </div>
      </li>`;
  }).join("");

  return `<ul class="steps">${items}</ul>`;
}

export const PATCH = Wrapper(async (req: NextRequest) => {
  try {
    const auth = await verifyUser(req);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message || "Unauthorized" },
        { status: auth.status },
      );
    }

    const body = await req.json();
    const safeData = validationSchema.safeParse(body);
    if (!safeData.success) {
      throw new Error("Data Validation Failed");
    }
    const { orderId, status } = body;
    const orders = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: status,
      },
      select: {
        id: true,
        status: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const userName = orders.user.name;
    const userEmail = orders.user.email;
    const sendHtml = statusTemplate
      .replace("{{customerName}}", userName)
      .replace("{{orderId}}", orderId)
      .replaceAll("{{STATUS}}", buildTrackerHtml(orders.status));

    await sendEmail(userEmail, getSubject(orderId, orders.status), sendHtml);

    return NextResponse.json(
      { success: true, message: "Status Changed Successfully!" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error || "Internal Server Error" },
      { status: 500 },
    );
  }
});
