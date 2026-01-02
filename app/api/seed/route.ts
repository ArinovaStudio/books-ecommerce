import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ProductCategory, KitType } from "@prisma/client";

export const maxDuration = 300; 
export const dynamic = 'force-dynamic';

function getClassNames(range: string): string[] {
    const basics = ["Nursery", "PP I", "PP II"];
    const upTo10 = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
    return [...basics, ...upTo10];
}

function getRandomName(type: 'parent' | 'student') {
    const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayan", "Diya", "Saanvi", "Ananya", "Aadhya", "Pari", "Kiara", "Myra", "Riya"];
    const lastNames = ["Sharma", "Verma", "Gupta", "Malhotra", "Bhatia", "Mehta", "Jain", "Agarwal", "Singh", "Patel", "Reddy", "Nair", "Kumar", "Chopra"];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

export async function GET(req: NextRequest) {
    try {
        // console.log("--- Starting Seeding Process ---");

        // Hash passwords ONCE to save time
        const commonAdminPass = await bcrypt.hash("admin123", 10);
        const commonSchoolPass = await bcrypt.hash("school123", 10);
        const commonUserPass = await bcrypt.hash("user123", 10);

        // Create Super Admin
        const adminEmail = "admin@globe.com";
        await prisma.user.upsert({
            where: { email: adminEmail },
            update: {},
            create: {
                name: "Super Administrator",
                email: adminEmail,
                password: commonAdminPass,
                role: "ADMIN",
                status: "ACTIVE",
                phone: "9999999988",
                address: "Headquarters"
            }
        });

        const schoolsList = [
            { name: "Auxilium High School", address: "Mahendra hills, Secunderabad-26", board: "State" },
            { name: "Auxilium High School (ICSE)", address: "Uppal", board: "ICSE" },
            { name: "St. Pious X High School", address: "Alwal", board: "State" },
            { name: "St. Pious X High School (Ramanagar)", address: "Ramanagar", board: "State" },
            { name: "St. Pious X High School (Mysor)", address: "Mysor", board: "State" },
            { name: "St. Joseph's School", address: "Habsiguda, Hyderabad", board: "State" },
            { name: "Holy Spirit High School (ICSE)", address: "Jeedimetla", board: "ICSE" },
            { name: "St. Ann’s English Medium School", address: "Armor", board: "State" },
            { name: "St. Ann’s CBSE School (Jangoan)", address: "Jangoan", board: "CBSE" },
            { name: "St. Ann’s CBSE School (Mahabubabad)", address: "Mahabubabad", board: "CBSE" },
            { name: "St. Ann’s CBSE School (Vikarabad)", address: "Vikarabad", board: "CBSE" },
            { name: "St. Joseph’s CBSE School", address: "Emjala", board: "CBSE" },
            { name: "St Mary's Centenary Junior College", address: "Secunderabad", board: "State" },
            { name: "Fathima CBSE School", address: "Mahabubabad", board: "CBSE" },
            { name: "St. Jude's CBSE School", address: "Vikarabad", board: "CBSE" },
            { name: "St. Jude's High School", address: "Vikarabad", board: "State" }
        ];

        const createdSchools = [];
        for (const [index, s] of schoolsList.entries()) {
            // console.log(`Processing School ${index + 1}/${schoolsList.length}: ${s.name}`);
            
            const cleanName = s.name.toLowerCase().replace(/[^a-z0-9]/g, "");
            const schoolEmail = `admin.${cleanName}${index}@globe.com`;

            let school = await prisma.school.findUnique({ where: { email: schoolEmail } });

            if (!school) {
                // Create School
                const classesList = getClassNames("upto-10");
                const currentYear = new Date().getFullYear().toString();
                const academicYear = `${currentYear}-${parseInt(currentYear) + 1}`;

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
                        phone: Math.floor(1000000000 + Math.random() * 9000000000).toString()
                    }
                });

                // Create Classes
                await prisma.class.createMany({
                    data: classesList.map(name => ({
                        name,
                        schoolId: school!.id,
                        academicYear,
                        sections: ["A", "B"]
                    }))
                });

                const fetchedClasses = await prisma.class.findMany({ where: { schoolId: school.id } });
                const firstClassId = fetchedClasses[0].id;

                // Create Products
                const productData = [
                    { name: "Mathematics Textbook", description: "NCERT Math Book", price: 250, category: ProductCategory.TEXTBOOK, stock: 500, brand: "NCERT", type: null, classId: firstClassId },
                    { name: "Science Textbook", description: "NCERT Science Book", price: 300, category: ProductCategory.TEXTBOOK, stock: 500, brand: "NCERT", type: null, classId: firstClassId },
                    { name: "Single Line Notebook", description: "140 Pages", price: 50, category: ProductCategory.NOTEBOOK, stock: 1000, brand: "Classmate", type: "Ruled", classId: firstClassId },
                    { name: "Geometry Box", description: "Standard Set", price: 150, category: ProductCategory.STATIONARY, stock: 300, brand: "Camlin", type: null, classId: firstClassId },
                    { name: "School Bag", description: "Waterproof", price: 800, category: ProductCategory.OTHER, stock: 100, brand: "Skybags", type: null, classId: firstClassId }
                ];

                const createdProducts = [];
                for (const p of productData) {
                    const product = await prisma.product.create({ data: p });
                    createdProducts.push(product);
                }
                const findProd = (namePart: string) => createdProducts.find(p => p.name.includes(namePart))?.id;

                // Create Kits & Students
                for (const cls of fetchedClasses) {
                    // Create Kit
                    if (findProd("Math") && findProd("Notebook")) {
                        await prisma.kit.create({
                            data: {
                                type: KitType.BASIC,
                                classId: cls.id,
                                totalPrice: 500,
                                language: "English",
                                items: {
                                    create: [
                                        { productId: findProd("Math")!, quantity: 1 },
                                        { productId: findProd("Notebook")!, quantity: 2 }
                                    ]
                                }
                            }
                        });
                    }

                    // Create 2 Students per class
                    const studentPromises = Array.from({ length: 2 }).map(async (_, i) => {
                        const iVal = i + 1;
                        const parentEmail = `p${iVal}.${cls.id.substring(0,4)}${index}@test.com`; 
                        
                        const parent = await prisma.user.create({
                            data: {
                                name: getRandomName('parent'),
                                email: parentEmail,
                                password: commonUserPass,
                                role: "USER",
                                status: "ACTIVE",
                                phone: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
                                address: "123 Parent St"
                            }
                        });

                        return prisma.student.create({
                            data: {
                                name: getRandomName('student'),
                                schoolId: school!.id,
                                classId: cls.id,
                                parentId: parent.id,
                                rollNo: `R-${Math.floor(Math.random() * 1000)}`,
                                dob: new Date("2015-01-01"),
                                gender: iVal % 2 === 0 ? "Male" : "Female",
                                section: "A",
                                parentEmail: parent.email,
                                address: "Same as parent",
                                isActive: true
                            }
                        });
                    });
                    await Promise.all(studentPromises);
                }
            } else {
                // console.log(`Skipping ${s.name} - Already exists`);
            }
            createdSchools.push(school);
        }

        return NextResponse.json({ 
            success: true, 
            message: "Database seeded successfully!", 
            data: { 
                schoolsCreated: createdSchools.length,
                schoolNames: createdSchools.map(s => s?.name)
            } 
        });

    } catch (error: any) {
        console.error("Seeding Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}