import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const SECRET_KEY = process.env.JWT_SECRET || "MY_SECRET_KEY";

export async function GET() {
  try {
    const adminEmail = "admin@test.com";
    const adminPassword = "admin1234";

    let admin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    // Create admin if not exists
    if (!admin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      admin = await prisma.user.create({
        data: {
          name: "Super Admin",
          email: adminEmail,
          password: hashedPassword,
          role: "ADMIN",
        },
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({
      success: true,
      message: "Admin logged in successfully",
      user: { email: admin.email, role: admin.role },
    });
  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
