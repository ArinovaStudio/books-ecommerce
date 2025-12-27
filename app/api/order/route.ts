import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      userId,
      studentId,
      school,
      class: className,
      section,
      academicYear,
      totalAmount,
      status,
    } = body;

    console.log(body);
    

    /* -----------------------------
       1️⃣ Validation
    ------------------------------ */
    if (
      !userId ||
      !studentId ||
      !school ||
      !className ||
      !section ||
      !academicYear ||
      typeof totalAmount !== "number"
    ) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    /* -----------------------------
       2️⃣ Create Order (CORRECT)
    ------------------------------ */
    const order = await prisma.order.create({
      data: {
        school,
        class: className,
        section,
        academicYear,
        totalAmount,
        status: status ?? "PENDING",

        user: {
          connect: { id: userId },
        },
        student: {
          connect: { id: studentId },
        },
      },
    });

    /* -----------------------------
       3️⃣ Success
    ------------------------------ */
    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Order Error:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
