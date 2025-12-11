import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET || "fallback-secret";

export async function verifyAdmin(req: NextRequest): Promise<{ success: boolean, message: string, status: number, user?: any }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "No token provided", status: 401 };
    }

    const decoded = jwt.verify(token, SECRET_KEY) as { id: string, email: string };

    if (!decoded.id) {
       return { success: false, message: "Invalid Token", status: 403 };
    }
    
    const adminId = decoded.id;

    const user = await prisma.user.findUnique({ where: { id: adminId }});

    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Admin access required", status: 403 };
    }

    return { success: true, message: "Admin is authenticated", status: 200, user };

  } catch (error) {
    return { success: false, message: "Invalid Token", status: 401 };
  }
}