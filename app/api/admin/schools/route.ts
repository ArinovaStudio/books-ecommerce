import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest){
    try {
        const body = await req.json();
        
    } catch (error) {
        console.error("School add error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}