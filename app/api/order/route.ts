import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyUser } from "@/lib/verify";
import { Wrapper } from "@/lib/api-handler";
import { orderReceiptTemplate } from "@/lib/templates";
import sendEmail from "@/lib/email";

const createOrderValidation = z.object({
  studentId: z.string().uuid("Invalid Student ID"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  items: z.array(
    z.object({
      productId: z.string().uuid("Invalid Product ID"),
      quantity: z.number().min(1, "Quantity must be at least 1")
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
    const userName = auth.user.name;
    const userEmail = auth.user.email;

    const body = await req.json();
    
    const validation = createOrderValidation.safeParse(body);

    if (!validation.success) {
        const errors = validation.error.errors.map((error) => ({ field: error.path[0], message: error.message }));
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

    if (!student) {
        return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    if (student.parentId !== userId) {
        return NextResponse.json({ success: false, message: "This student does not belong to you" }, { status: 403 });
    }

    if (student.isActive === false) {
        return NextResponse.json({ success: false, message: "This student is inactive" }, { status: 403 });
    }

    const productIds = items.map(i => i.productId);
    const dbProducts = await prisma.product.findMany({ where: { id: { in: productIds } }});

    let totalAmount = 0;
    const productMap = new Map(dbProducts.map(p => [p.id, p]));
    const validOrderItems: { productId: string, quantity: number, price: number }[] = [];

    const emailItems: { name: string, quantity: number, price: number }[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      
      if (!product) {
        return NextResponse.json({ success: false, message: `Product ID ${item.productId} invalid or not found` }, { status: 400 });
      }
      
      const lineTotal = product.price * item.quantity;
      totalAmount += lineTotal;

      validOrderItems.push({ 
          productId: item.productId, 
          quantity: item.quantity, 
          price: product.price 
      });

      emailItems.push({
          name: product.name,
          quantity: item.quantity,
          price: product.price
      });
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
              totalAmount: totalAmount                
          }
      });

      // Create Order Items
      if (validOrderItems.length > 0) {
          await tx.orderItem.createMany({
              data: validOrderItems.map(item => ({
                  orderId: order.id,
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price
              }))
          });
      }

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
    });

    const emailData = orderReceiptTemplate(userName, orderId, student.name, totalAmount, emailItems);
    await sendEmail(userEmail, emailData.subject, emailData.html);
    
    return NextResponse.json({ success: true, message: "Order placed successfully", orderId }, { status: 201 });

  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
});