import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyUser } from "@/lib/verify";
import { getFullImageUrl } from "@/lib/upload";
import { Wrapper } from "@/lib/api-handler";

const createOrderValidation = z.object({
  studentId: z.string().uuid(),
  paymentMethod: z.string().min(1, "Payment method is required"),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().min(1)
    })
  ).min(1, "Order must contain at least one item") 
});

export const POST = Wrapper(async (req: NextRequest) => {
  try {

    const auth = await verifyUser(req);

    if (!auth.success) {
        return NextResponse.json({ success: false, message: auth.message || "Unauthorized" }, { status: auth.status });
    }

    const userId = auth.user.id;
    const body = await req.json();
    
    const validation = createOrderValidation.safeParse(body);

    if (!validation.success) {
        const errors = validation.error.errors.map((error) => ({ field: error.path[0], message: error.message }));;
        return NextResponse.json({ success: false, message: "Validation error", errors }, { status: 400 });
    }

    const { studentId, items, paymentMethod } = validation.data;

    const student = await prisma.student.findUnique({ 
        where: { id: studentId },
        include: { 
            class: true,
            school: true
        }
    });

    if (!student || student.parentId !== userId) {
        return NextResponse.json({ success: false, message: "Invalid Student ID or Unauthorized" }, { status: 403 });
    }

    if (student.isActive === false) {
      return NextResponse.json({ success: false, message: "Student is inactive" }, { status: 403 });
    }

    const productIds = items.map(i => i.productId);
    const dbProducts = await prisma.product.findMany({ where: { id: { in: productIds } }});

    let totalAmount = 0;
    const productMap = new Map(dbProducts.map(p => [p.id, p]));

    const validOrderItems: { productId: string, quantity: number, price: number }[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      
      if (!product) {
        return NextResponse.json({ success: false, message: `Product ID ${item.productId} invalid` }, { status: 400 });
      }

      totalAmount += product.price * item.quantity;
      validOrderItems.push({ productId: item.productId, quantity: item.quantity, price: product.price });
    }

    const orderId = await prisma.$transaction(async (tx) => {
      
      // Create Order
      const order = await tx.order.create({
          data: {
              userId, 
              studentId, 
              school: student.school.name, 
              class: student.class.name,
              section: student.section,
              academicYear: student.class.academicYear,       
              status: "Ordered",
              totalAmount                
          }
      });

      // Create Order Items
      await tx.orderItem.createMany({
          data: validOrderItems.map(item => ({
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
          }))
      });

      // Create Payment Record
      await tx.payment.create({
          data: {
              orderId: order.id,
              amount: totalAmount,
              method: paymentMethod,
              status: "PENDING"
          }
      });

      return order.id;
    })
    
    return NextResponse.json({ success: true, message: "Order created successfully", orderId }, { status: 201 });

  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
})

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

    if (!orders || orders.length === 0) {
      return NextResponse.json({ success: false, message: "No Order history" }, { status: 404 });
    }

    orders.forEach((order) => {
      if (order.items) {
        order.items.forEach((item) => {
          if (item.product?.image) {
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