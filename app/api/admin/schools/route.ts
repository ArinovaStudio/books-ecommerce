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

        const currentUser = auth.user;
        if (currentUser.role === "SUB_ADMIN" && currentUser.schoolId) {
            return NextResponse.json({ success: false, message: "Sub-Admins can only manage one school" }, { status: 403 });
        }

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const board = formData.get("board") as string;
        const addressString = formData.get("address") as string;
        const imageFile = formData.get("image") as File | null;

        if (!name || !board) {
            return NextResponse.json({ success: false, message: "Name and Board are required" }, { status: 400 });
        }

        let addressJson = {};
        if (addressString) {
            try {
                addressJson = JSON.parse(addressString);
            } catch (e) {
                return NextResponse.json({ success: false, message: "Invalid address format" }, { status: 400 });
            }
        }

        let imageUrl = null;
        if (imageFile) {
            try {
                imageUrl = await saveImage(imageFile);
            } catch (error: any) {
                return NextResponse.json({ success: false, message: "Image upload failed", error: error.message }, { status: 400 });
            }
        }

        const newSchool = await prisma.$transaction(async (tx) => {

            const school = await tx.school.create({ data: { name, board, address: addressJson, image: imageUrl }});

            if (currentUser.role === "SUB_ADMIN") {
                await tx.user.update({ where: { id: auth.user.id }, data: { schoolId: school.id }});
            }
        
            return school;
        })
        

        newSchool.image = getFullImageUrl(newSchool.image as string, req);

        return NextResponse.json({ success: true, message: "School created successfully", school: newSchool }, { status: 201 });
        
    } catch (error) {
        console.error("School add error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}