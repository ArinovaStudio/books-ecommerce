import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Helper: Generate class list
function getClassNames(range: string): string[] {
    const basics = ["Nursery", "LKG", "UKG"];
    const upTo8 = [...basics, "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
    const upTo10 = [...upTo8, "Class 9", "Class 10"];
    const upTo12 = [...upTo10, "Class 11", "Class 12"];

    switch (range) {
        case "upto-8": return [...basics, ...upTo8];
        case "upto-10": return [...basics, ...upTo10];
        case "upto-12": return [...basics, ...upTo12];
        default: return [];
    }
}

// Helper: Generate realistic names
function getRandomName(type: 'parent' | 'student') {
    const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayan", "Diya", "Saanvi", "Ananya", "Aadhya", "Pari", "Kiara", "Myra", "Riya"];
    const lastNames = ["Sharma", "Verma", "Gupta", "Malhotra", "Bhatia", "Mehta", "Jain", "Agarwal", "Singh", "Patel", "Reddy", "Nair", "Kumar", "Chopra"];
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${first} ${last}`;
}

export async function GET(req: NextRequest) {
    try {
        // --- 1. SEED INDIVIDUAL PRODUCTS FIRST ---
        // We need products in the DB before we can put them into Kits
        const productList = [
            { name: "Mathematics Textbook", description: "NCERT Math Book", price: 250, category: "TEXTBOOK", stock: 500, brand: "NCERT", },
            { name: "Science Textbook", description: "NCERT Science Book", price: 300, category: "TEXTBOOK", stock: 500, brand: "NCERT", },
            { name: "English Reader", description: "Literature Reader", price: 200, category: "TEXTBOOK", stock: 500, brand: "NCERT", },
            { name: "Single Line Notebook", description: "140 Pages Notebook", price: 50, category: "NOTEBOOK", stock: 1000, brand: "Classmate", type: "Ruled", },
            { name: "Drawing File", description: "A3 Size Drawing File", price: 80, category: "NOTEBOOK", stock: 500, brand: "Navneet", type: "Math" },
            { name: "Geometry Box", description: "Complete Geometry Set", price: 150, category: "STATIONARY", stock: 300 },
            { name: "Blue Gel Pen Set", description: "Pack of 5 Pens", price: 50, category: "STATIONARY", stock: 1000 },
            { name: "School Bag", description: "Waterproof School Bag", price: 800, category: "OTHER", stock: 100 },
        ];

        // Create products and store references
        const createdProducts = [];
        for (const p of productList) {
            const product = await prisma.product.create({
                data: p
            });
            createdProducts.push(product);
        }

        // Helper to find a product ID by partial name match
        const findProdId = (namePart: string) => createdProducts.find(p => p.name.includes(namePart))?.id;


        // --- 2. CREATE ADMIN ---
        const adminEmail = "admin@globe.com";
        const adminPass = await bcrypt.hash("admin123", 12);

        await prisma.user.upsert({
            where: { email: adminEmail },
            update: {},
            create: {
                name: "Super Administrator",
                email: adminEmail,
                password: adminPass,
                role: "ADMIN",
                status: "ACTIVE",
                phone: "9999999988",
                address: "Headquarters"
            }
        });

        const schoolsData = [
            { name: "Greenwood High", email: "greenwood@test.com", address: "Seattle", classRange: "upto-12", languages: ["English", "Spanish"], board: "CBSE" },
            { name: "City International", email: "city@test.com", address: "New York", classRange: "upto-10", languages: ["English", "French"], board: "ICSE" }
        ];

        const createdSchools = [];

        for (const s of schoolsData) {
            let school = await prisma.school.findUnique({ where: { email: s.email } });

            if (!school) {
                const classesList = getClassNames(s.classRange);
                const currentYear = new Date().getFullYear().toString();
                const academicYear = `${currentYear}-${parseInt(currentYear) + 1}`;

                // --- 3. CREATE SCHOOL ---
                school = await prisma.school.create({
                    data: {
                        name: s.name,
                        email: s.email,
                        address: s.address,
                        classRange: s.classRange,
                        languages: s.languages,
                        board: s.board,
                        numberOfClasses: classesList.length,
                        status: "ACTIVE",
                        image: ""
                    }
                });

                // --- 4. CREATE SUB-ADMIN ---
                const subAdminPass = await bcrypt.hash("school123", 12);
                await prisma.user.create({
                    data: {
                        name: `${s.name} Admin`,
                        email: `admin.${s.email}`,
                        password: subAdminPass,
                        role: "SUB_ADMIN",
                        schoolId: school.id,
                        status: "ACTIVE",
                        phone: Math.floor(1000000000 + Math.random() * 9000000000).toString()
                    }
                });

                // --- 5. CREATE CLASSES ---
                // We map and create promises, then await all
                await prisma.class.createMany({
                    data: classesList.map(name => ({
                        name,
                        schoolId: school.id,
                        academicYear,
                        sections: ["A", "B"]
                    }))
                });

                // Fetch classes back to get their IDs
                const fetchedClasses = await prisma.class.findMany({ where: { schoolId: school.id } });

                // --- 6. CREATE KITS FOR EACH CLASS ---
                // For every class, we create a 'BASIC' and 'ADVANCE' kit
                for (const cls of fetchedClasses) {

                    // A. Create BASIC Kit
                    // Contains: 1 Math Book, 1 English Book, 2 Notebooks
                    const basicItems = [
                        { productId: findProdId("Mathematics")!, quantity: 1 },
                        { productId: findProdId("English")!, quantity: 1 },
                        { productId: findProdId("Notebook")!, quantity: 2 },
                    ];

                    // Calculate random total price roughly based on items
                    const basicPrice = 250 + 200 + (50 * 2);

                    await prisma.kit.create({
                        data: {
                            type: "BASIC",
                            classId: cls.id, // Mandatory Relation
                            totalPrice: basicPrice,
                            language: "English",
                            items: {
                                create: basicItems // Nested write for KitItems
                            }
                        }
                    });

                    // B. Create ADVANCE Kit
                    // Contains: Basic items + Science Book + Geometry Box + Bag
                    const advanceItems = [
                        ...basicItems,
                        { productId: findProdId("Science")!, quantity: 1 },
                        { productId: findProdId("Geometry")!, quantity: 1 },
                        { productId: findProdId("Bag")!, quantity: 1 },
                    ];
                    const advancePrice = basicPrice + 300 + 150 + 800;

                    await prisma.kit.create({
                        data: {
                            type: "ADVANCE",
                            classId: cls.id,
                            totalPrice: advancePrice,
                            language: "English",
                            items: {
                                create: advanceItems
                            }
                        }
                    });
                }

                // --- 7. CREATE USERS (PARENTS & STUDENTS) ---
                for (let i = 1; i <= 5; i++) {
                    const parentPass = await bcrypt.hash("user123", 12);
                    const parentName = getRandomName('parent');
                    const parentEmail = `parent${i}.${school.name.split(" ")[0].toLowerCase()}@test.com`;

                    const parent = await prisma.user.create({
                        data: {
                            name: parentName,
                            email: parentEmail,
                            password: parentPass,
                            role: "USER",
                            status: "ACTIVE",
                            phone: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
                            address: "123 Parent St"
                        }
                    });

                    const randomClass = fetchedClasses[Math.floor(Math.random() * fetchedClasses.length)];
                    const studentName = getRandomName('student');

                    await prisma.student.create({
                        data: {
                            name: studentName,
                            schoolId: school.id,
                            classId: randomClass.id,
                            parentId: parent.id,
                            rollNo: `R-${100 + i}`,
                            dob: new Date("2015-01-01"),
                            gender: i % 2 === 0 ? "Male" : "Female",
                            section: randomClass.sections[0],
                            parentEmail: parent.email,
                            address: "Same as parent"
                        }
                    });
                }
            }
            createdSchools.push(school);
        }

        return NextResponse.json({
            success: true,
            message: "Database seeded successfully with Products, Schools, Classes, Kits, and Users!",
            data: {
                admin: { email: adminEmail, password: "admin123" },
                schools: createdSchools.map(s => s.name)
            }
        });

    } catch (error: any) {
        console.error("Seeding Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}