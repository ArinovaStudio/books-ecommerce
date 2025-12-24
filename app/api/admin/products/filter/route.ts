import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {schoolId,classId} = await req.json();
    if(!schoolId || !classId){
        return NextResponse.json({success:false,message: "School Id Or class id is not present"});
    }
    try {
        const products = await prisma.product.findMany({ where:{classId: classId, class:{schoolId:schoolId}}, orderBy: { name: 'asc' } });
        return NextResponse.json({ success: true, data: products });
        // return NextResponse.json({success: false,message: "Runned"});
    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to fetch products" }, { status: 500 });
    }
}