import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ProductCategory } from "@prisma/client";

export const maxDuration = 300; 
export const dynamic = 'force-dynamic';

function getClassNames(range: string): string[] {
    const basics = ["Nursery", "PP I", "PP II"];
    const upTo10 = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
    return [...basics, ...upTo10];
}



export async function GET(req: NextRequest) {
    try {
        console.log("--- Starting Seeding Process ---");

        const commonAdminPass = await bcrypt.hash("admin123", 12);
        const commonSchoolPass = await bcrypt.hash("school123", 12);
        
        const adminEmail = "admin@glow-nest.in";
        await prisma.user.upsert({
            where: { email: adminEmail },
            update: {},
            create: {
                name: "Super Administrator",
                email: adminEmail,
                password: commonAdminPass,
                role: "ADMIN",
                status: "ACTIVE",
                phone: "9999999999",
                address: "Headquarters",
            }
        });

        const schoolsList = [
            { name: "Auxilium High School", address: "Mahendra hills, Secunderabad-26", board: "State" },
        ];
        
        for (const [index, s] of schoolsList.entries()) {
            const cleanName = s.name.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 15);
            const schoolEmail = `admin.${cleanName}${index}@glow-nest.in`;
            let school = await prisma.school.findUnique({ where: { email: schoolEmail } });

            if (!school) {
                // Create School
                const classesList = getClassNames("upto-10");
                school = await prisma.school.create({
                    data: {
                        name: s.name,
                        email: schoolEmail,
                        address: s.address,
                        
                        classRange: "upto-10",
                        languages: ["English", "Telugu", "Hindi"],
                        board: s.board,
                        numberOfClasses: classesList.length,
                        status: "ACTIVE",
                        image: ""
                    }
                });

                // Create School Sub-Admin
                await prisma.user.create({
                    data: {
                        name: `${s.name} Admin`,
                        email: schoolEmail,
                        password: commonSchoolPass,
                        role: "SUB_ADMIN",
                        schoolId: school.id,
                        status: "ACTIVE",
                        phone: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
                        address: s.address,
                    }
                });
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: "Database seeded successfully!",
        });

    } catch (error: any) {
        console.error("Seeding Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}