import { NextResponse, NextRequest } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET ||
      !process.env.SUBSCRIPTION_PLAN_ID
    ) {
      return NextResponse.json(
        { error: "Razorpay credentials not configured" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { email, name } = await req.json();

    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.SUBSCRIPTION_PLAN_ID,
      customer_notify: 1,
      quantity: 1,
      total_count: 1,
      notes: {
        email,
        userName: name,
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Razorpay subscription creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { email, userName, paymentId } = await req.json();

    // await db.insert(UserSubscription).values({
    //   email,
    //   userName,
    //   active: true,
    //   paymentId,
    //   joinDate: new Date(),
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving subscription:", error);
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}
