import { NextRequest, NextResponse } from 'next/server';
import { saveImage } from '@/lib/upload';
import prisma from '@/lib/prisma';
import { Wrapper } from '@/lib/api-handler';
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "MY_SECRET_KEY";

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
        const formData = await req.formData();

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;   
        const schoolName = formData.get("schoolName") as string;
        const address = formData.get("location") as string;
        const imageFile = formData.get("image") as File | null;
        const classRange = formData.get("classes") as string;
        const languagesRaw = formData.get("languages") as string;
        const board = formData.get("board") as string;

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
                data: { name: schoolName, email, image: imageUrl, address, classRange, board,
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
            const newUser = await tx.user.create({
                data: {
                    name, email,
                    password: hashedPassword,
                    role: "SUB_ADMIN",
                    schoolId: school.id,
                    status: "ACTIVE"
                }
            });

            return { school, user: newUser };
        });

        const token = jwt.sign({ id: result.user.id, email: result.user.email, role: result.user.role }, SECRET_KEY, { expiresIn: "7d" });
            
        const cookieStore = await cookies();
    
        cookieStore.set("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        return NextResponse.json({ success: true, message: "Sub-admin registered successfully" }, { status: 201 });

    } catch (error: any) {
        console.error("Registration Error:", error);
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
});