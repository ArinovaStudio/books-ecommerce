import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyUser } from "@/lib/verify";
import { Wrapper } from "@/lib/api-handler";
import sendEmail from "@/lib/email";
import { customAlphabet } from "nanoid";

const validationSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    "ORDER_PLACED",
    "PACKAGING_DONE",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ]),
});

export const PATCH = Wrapper(async (req: NextRequest) => {
  try {
    const auth = await verifyUser(req);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message || "Unauthorized" },
        { status: auth.status }
      );
    }

    const body = await req.json();
    const safeData = validationSchema.safeParse(body);
    if (!safeData.success) {
      throw new Error("Data Validation Failed");
    }
    const { orderId, status } = body;
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: status,
      },
    });
    return NextResponse.json(
      { success: true, message: "Status Changed Successfully!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error || "Internal Server Error" },
      { status: 500 }
    );
  }
});
