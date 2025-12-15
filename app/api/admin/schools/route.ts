import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/verify';
import { getFullImageUrl, saveImage } from '@/lib/upload';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest){
    try {
        const auth = await verifyAdmin(req);

        if (!auth.success){
            return NextResponse.json({ success: false, message: "Admin access required", status: 403 });
        }

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const board = formData.get("board") as string;
        const imageFile = formData.get("image") as File | null;
        const addressString = formData.get("address") as string; 
        let addressJson = JSON.parse(addressString);

        if (!name || !board) {
            return NextResponse.json({ success: false, message: "Name and Board are required" }, { status: 400 });
        }

        let imageUrl = null;
        if (imageFile) {
            try {
                imageUrl = await saveImage(imageFile);
            } catch (error: any) {
                return NextResponse.json({ success: false, message: "Image upload failed", error: error.message }, { status: 400 });
            }
        }

        const newSchool = await prisma.school.create({ data: { name, board, address: addressJson, image: imageUrl }});

        newSchool.image = getFullImageUrl(newSchool.image as string, req);

        return NextResponse.json({ success: true, message: "School created successfully", school: newSchool }, { status: 201 });
        
    } catch (error) {
        console.error("School add error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}