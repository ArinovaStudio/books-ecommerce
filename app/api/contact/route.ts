import { Wrapper } from "@/lib/api-handler";
import sendEmail from "@/lib/email";
import prisma from "@/lib/prisma";
import { newContactQueryTemplate } from "@/lib/templates";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export const POST = Wrapper(async (req: NextRequest) => {
  try {
    const body = await req.json();

    const validation = contactFormSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.errors.map((error) => ({ field: error.path[0], message: error.message }));
      return NextResponse.json({ success: false, message: "Validation error", errors },{ status: 400 });
    }

    const { name, email, phone, address, message } = validation.data;

    const newQuery = await prisma.contactQuery.create({
      data: {
        name,
        email,
        phone: phone || null,
        address: address || null,
        message,
      },
    });

    const systemAdmins = await prisma.user.findMany({
        where: { role: "ADMIN", status: "ACTIVE" },
        select: { email: true, name: true }
    });

    // Send email notification to Admins
    if (systemAdmins.length > 0) {
        const emailData = newContactQueryTemplate(name, email, phone, message);
        
        systemAdmins.forEach(admin => {
            sendEmail(admin.email, emailData.subject, emailData.html).catch(err => console.error(`Failed to send contact email to ${admin.email}`, err));
        });
    }

    return NextResponse.json({ success: true, message: "Your message has been sent successfully.", data: newQuery }, { status: 201 });
  } catch (error) {
    console.error("Contact Form Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" },{ status: 500 });
  }
});

export const GET = Wrapper(async (req: NextRequest) => {
  try {
    const auth = await verifyAdmin(req);
    if (!auth.success || auth.user.role !== "ADMIN") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const queries = await prisma.contactQuery.findMany({
        orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, queries }, { status: 200 });

  } catch (error) {
    console.error("Get Queries Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
});