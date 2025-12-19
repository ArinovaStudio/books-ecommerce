import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const statusSchema = z.object({
  userId: z.string().uuid("Invalid User ID format"),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"], {
    errorMap: () => ({ message: "Status must be ACTIVE, INACTIVE, or SUSPENDED" })
  })
});

export const PATCH = Wrapper(async (req: NextRequest) => {
    try {
        const auth = await verifyAdmin(req);
    
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message || "Admin access required" }, { status: auth.status });
        }

        if (auth.user.role !== "ADMIN") {
            return NextResponse.json({ success: false, message: "Only Admins can change user status" }, { status: 403 });
        }

        const body = await req.json();

        const validation = statusSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ success: false, message: validation.error.errors[0].message }, { status: 400 });
        }

        const { status, userId }: { status: string; userId: string } = validation.data;

        if (userId === auth.user.id) {
            return NextResponse.json({ success: false, message: "You cannot change your own account status" }, { status: 400 });
        }

        const targetUser = await prisma.user.findUnique({ where: { id: userId } });
        
        if (!targetUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { status: status as "ACTIVE" | "INACTIVE" },
            select: { id: true, name: true, email: true, status: true, role: true }
        });

        return NextResponse.json({ success: true, message: `User status changed to ${status}`, user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Update User Status error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
});