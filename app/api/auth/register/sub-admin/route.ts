import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";
import { Wrapper } from "@/lib/api-handler";

const registerValidation = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().optional(),
});

const SECRET_KEY = process.env.JWT_SECRET || "MY_SECRET_KEY";

export const POST = Wrapper(async(req: NextRequest) => {
  try {
    const body = await req.json();

    const validation = registerValidation.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.errors.map((error) => ({ field: error.path[0], message: error.message }));
      return NextResponse.json({ success: false, message: "Validation error", errors }, { status: 400 });
    }

    const { name, email, phone, password, address } = validation.data;

    const existingUser = await prisma.user.findFirst({ where: { OR: [ { email }, { phone: phone }]}});

    if (existingUser) {
      return NextResponse.json({ success: false, message: "User with this email or phone already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({ data: { name, email, phone, password: hashedPassword, role: "SUB_ADMIN",
    address, schoolId: null } });

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, SECRET_KEY, { expiresIn: "7d" });
        
    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Sub-Admin account created successfully" }, { status: 201 });

  } catch (error) {
    console.error("Register Sub-Admin Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
})