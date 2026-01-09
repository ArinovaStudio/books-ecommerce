import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/lib/verify";
import { Wrapper } from "@/lib/api-handler";
import { getFullImageUrl } from "@/lib/upload";

export const GET = Wrapper(async (req: NextRequest) => {
  try {
    const auth = await verifyUser(req);

    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message || "Unauthorized" }, { status: auth.status });
    }

    const userId = auth.user.id;

    const orders = await prisma.order.findMany({ 
        where: { userId }, 
        include: { 
            student: { select: { name: true, rollNo: true } }, 
            payment: { select: { amount: true, status: true, method: true }},
            items: { 
                include: { 
                    product: { select: { name: true, image: true } } 
                }
            }
        }, 
        orderBy: { createdAt: "desc" } 
    });

    if (!orders) {
      return NextResponse.json({ success: false, message: "No Order history" }, { status: 404 });
    }

    orders.forEach((order) => {
      if (order.items) {
        order.items.forEach((item) => {
          if (item.product.image) {
            item.product.image = getFullImageUrl(item.product.image, req);
          }
        });
      }
    });

    return NextResponse.json({ success: true, orders }, { status: 200 });

  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
})