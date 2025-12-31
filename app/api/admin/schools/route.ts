import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/verify';
import { saveImage } from '@/lib/upload';
import prisma from '@/lib/prisma';
import { Wrapper } from '@/lib/api-handler';
import bcrypt from "bcryptjs";

function getClassNames(range: string): string[] {
    const basics = ["Nursery", "PP I", "PP II"];
    const upTo8 = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
    const upTo10 = [...upTo8, "Class 9", "Class 10"];
    const upTo12 = [...upTo10, "Class 11", "Class 12"];

    switch (range) {
        case "upto-8": return [...basics, ...upTo8];
        case "upto-10": return [...basics, ...upTo10];
        case "upto-12": return [...basics, ...upTo12];
        default: return [];
    }
}

export const POST = Wrapper(async (req: NextRequest) => {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success || auth.user.role !== "ADMIN") {
            return NextResponse.json({ success: false, message: "Only Admin can add schools" }, { status: 403 });
        }

        const formData = await req.formData();

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const address = formData.get("location") as string; 
        const classRange = formData.get("classRange") as string;
        const languagesRaw = formData.get("languages") as string;
        const board = formData.get("board") as string;
        const imageFile = formData.get("image") as File | null;

        if (!name || !email || !password || !address || !classRange || !board) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        const existingSchool = await prisma.school.findUnique({ where: { email } });
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingSchool || existingUser) {
            return NextResponse.json({ success: false, message: "Email is already in use by a School or User" }, { status: 409 });
        }

        let imageUrl = "";
        if (imageFile && imageFile.size > 0) {
            try {
                imageUrl = await saveImage(imageFile);
            } catch (error) {
                console.error("Image upload failed", error);
            }
        }

        const classesToCreate = getClassNames(classRange);
        const currentYear = new Date().getFullYear().toString();
        const academicYear = `${currentYear}-${parseInt(currentYear) + 1}`;

        const result = await prisma.$transaction(async (tx) => {
            
            const school = await tx.school.create({ 
                data: { name, email, image: imageUrl, address, classRange, board,
                    languages: languagesRaw ? JSON.parse(languagesRaw) : [], 
                    numberOfClasses: classesToCreate.length,
                    status: "ACTIVE"
                }
            });

            if (classesToCreate.length > 0) {
                await tx.class.createMany({
                    data: classesToCreate.map(className => ({
                        name: className,
                        schoolId: school.id,
                        academicYear: academicYear,
                        sections: ["A"] 
                    }))
                });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            await tx.user.create({
                data: {
                    name: `${name} Admin`,
                    email,
                    password: hashedPassword,
                    role: "SUB_ADMIN",
                    schoolId: school.id,
                    status: "ACTIVE"
                }
            });

            return school;
        });

        return NextResponse.json({ success: true, message: "School and Classes created successfully" }, { status: 201 });

    } catch (error: any) {
        console.error("Add School Error:", error);
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
});