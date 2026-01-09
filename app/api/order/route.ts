import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyUser } from "@/lib/verify";
import { Wrapper } from "@/lib/api-handler";
import { orderReceiptTemplate, newOrderAlertTemplate } from "@/lib/templates"; 
import sendEmail from "@/lib/email";
import { customAlphabet } from "nanoid";

const generateOrderId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 12);

const createOrderValidation = z.object({
  studentId: z.string().uuid("Invalid Student ID"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  
  phone: z.string().min(10, "Valid phone number is required"),
  landmark: z.string().min(1, "Landmark is required"),
  pincode: z.string().min(6, "Valid pincode is required"),

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

    const { studentId, items, paymentMethod, phone, landmark, pincode } = validation.data;

    
    const student = await prisma.student.findUnique({ 
        where: { id: studentId },
        include: { 
            class: true,
            school: {
                include: {
                    subAdmins: {
                        where: { role: "SUB_ADMIN", status: "ACTIVE" },
                        select: { email: true, name: true }
                    }
                }
            }
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

    // Validate Products & Calculate Total
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

    // Transaction
    const orderId = await prisma.$transaction(async (tx) => {

      const newOrderId = generateOrderId();
      
      const order = await tx.order.create({
          data: {
              id: newOrderId,
              userId, 
              studentId, 
              school: student.school.name, 
              class: student.class.name,
              section: student.section,
              academicYear: student.class.academicYear,       
              status: "Ordered",
              totalAmount: totalAmount,
              phone,
              landmark,
              pincode
          }
      });

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

    // send mails to parent
    const userEmailData = orderReceiptTemplate(userName, orderId, student.name, totalAmount, emailItems);
    sendEmail(userEmail, userEmailData.subject, userEmailData.html).catch(err => console.error("User email failed", err));

    // send mail to sub admins
    if (student.school.subAdmins.length > 0) {
        student.school.subAdmins.forEach(admin => {
            const adminEmailData = newOrderAlertTemplate( admin.name, orderId, student.name, `${student.class.name} - ${student.section}`, totalAmount);
            sendEmail(admin.email, adminEmailData.subject, adminEmailData.html).catch(err => console.error("Admin notification failed", err));
        });
    }

    // send mail to all admins
    const systemAdmins = await prisma.user.findMany({
        where: { role: "ADMIN", status: "ACTIVE" },
        select: { email: true, name: true }
    });

    if (systemAdmins.length > 0) {
        systemAdmins.forEach(admin => {
            const systemAdminEmailData = newOrderAlertTemplate(
                admin.name,
                orderId,
                student.name,
                `${student.class.name} - ${student.section} (${student.school.name})`,
                totalAmount
            );

            sendEmail(admin.email, systemAdminEmailData.subject, systemAdminEmailData.html).catch(err => console.error("System Admin notification failed", err));
        });
    }

    return NextResponse.json({ success: true, message: "Order placed successfully", orderId }, { status: 201 });

  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
});