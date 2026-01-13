import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});

export async function POST(req) {
    try {
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET_KEY) {
            return NextResponse.json(
                { error: 'Razorpay credentials not configured' },
                { status: 500 }
            );
        }
        const { email, name } = await req.json();

        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.SUBSCRIPTION_PLAN_ID,
            customer_notify: 1,
            quantity: 1,
            total_count: 1,
            addons: [],
            notes: {
                email: email,
                userName: name
            }
        });
        return NextResponse.json(subscription);
    }
    catch (error) {
        console.error('Razorpay order creation failed:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const { email, userName, paymentId } = await req.json();
        
        await db.insert(UserSubscription).values({
            email: email,
            userName: userName,
            active: true,
            paymentId: paymentId,
            joinData: new Date()
        });
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving subscription:', error);
        return NextResponse.json(
            { error: 'Failed to save subscription' },
            { status: 500 }
        );
    }
}