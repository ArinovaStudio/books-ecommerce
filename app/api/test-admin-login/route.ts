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

    const admin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Seeded admin not found. Run prisma seed." },
        { status: 404 }
      );
    }

    if (admin.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Not an admin account" },
        { status: 403 }
      );
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(adminPassword, admin.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    // ✅ Sign JWT
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
      message: "Logged in as seeded Admin successfully",
      user: { email: admin.email, role: admin.role },
    });
  } catch (error: any) {
    console.error("Test Login Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
