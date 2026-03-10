import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/lib/verify";
import { Wrapper } from "@/lib/api-handler";
import { compare, hash } from "bcryptjs";

export const POST = Wrapper(async (req: NextRequest) => {
  try {
    const auth = await verifyUser(req);

    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message || "Unauthorized" },
        { status: auth.status }
      );
    }
    const userId = auth.user.id;
    const { currentPass, newPass } = await req.json();
    if (!currentPass || !newPass) {
      return NextResponse.json(
        { success: false, message: "Empty Fields Must not be passed!" },
        { status: 403 }
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User Not Found!" },
        { status: 403 }
      );
    }
    const result = await compare(currentPass, user.password);
    if (!result) {
      return NextResponse.json(
        { success: false, message: "Current Password Is Incorrect!" },
        { status: 403 }
      );
    }
    const hashedPass = await hash(newPass, 12);
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPass,
      },
    });
    return NextResponse.json(
      { success: true, message: "Password Updated Successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
});
