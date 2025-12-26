import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { Wrapper } from "@/lib/api-handler";

const loginValidation = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const SECRET_KEY = process.env.JWT_SECRET || "MY_SECRET_KEY";

export const POST = Wrapper(async (req: NextRequest) => {
  try {
    const body = await req.json();

    const validation = loginValidation.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, message: "validation error" }, { status: 400 });
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json({ success: false, message: `Account is ${user.status.toLowerCase()}. Contact support.` }, { status: 403 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Password Incorrect" }, { status: 401 });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "7d" });

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // console.log("\nuser = ", user)

    return NextResponse.json({ success: true, message: "User login successfully", user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
})