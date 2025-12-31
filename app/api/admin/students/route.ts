import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { verifyAdmin } from '@/lib/verify';
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// Students filtered list
export const GET = Wrapper(async (req: NextRequest) => {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
        }

        const user = auth.user;

        // console.log("\nuser = ",user)

        // if (user.role !== "SUB_ADMIN" || !user.schoolId) {
        //     return NextResponse.json({ success: false, message: "Only School Admins can view students" }, { status: 403 });
        // }

        const { searchParams } = new URL(req.url);
        const classId = searchParams.get("classId");
        const section = searchParams.get("section");
        const name = searchParams.get("name");
        const rollNo = searchParams.get("rollNo");
        const schoolId = searchParams.get("schoolId");

        if (!schoolId) {
            return NextResponse.json({ success: false, message: "School ID not found" }, { status: 404 });
        }

        const whereClause: any = { schoolId };

        if (classId) {
            whereClause.classId = classId;
        }
        if (section) {
            whereClause.section = { equals: section, mode: "insensitive" };
        }
        if (rollNo) {
            whereClause.rollNo = { equals: rollNo, mode: "insensitive" };
        }
        if (name) {
            whereClause.name = { contains: name, mode: "insensitive" };
        }
        console.log(whereClause);
        

        const students = await prisma.student.findMany({
            where: whereClause,
            include: {
                class: { select: { name: true, academicYear: true } },
                parent: { select: { name: true, email: true, phone: true } }
            },
            orderBy: [{ class: { name: 'asc' } }, { section: 'asc' }, { rollNo: 'asc' }]
        });

        return NextResponse.json({ success: true, count: students.length, students }, { status: 200 });

    } catch (error) {
        console.error("Fetch Students Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
})

const createStudentValidation = z.object({
    name: z.string().min(1, "Name is required"),
    rollNo: z.string().min(1, "Roll Number is required"),
    classId: z.string().min(1, "Invalid Class ID"),
    section: z.string().min(1, "Section is required"),
    parentEmail: z.string().email("Invalid Parent Email"),

    dob: z.string().optional(),
    gender: z.string().optional(),
    bloodGroup: z.string().optional(),
    address: z.string().optional(),
    password: z.string().optional(),
});

// Add new student
export const POST = Wrapper(async (req: NextRequest) => {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
        }

        const user = auth.user;
        // if (user.role !== "SUB_ADMIN" || !user.schoolId) {
        //     return NextResponse.json({ success: false, message: "Only Sub Admins can add students" }, { status: 403 });
        // }

        const body = await req.json();
        const validation = createStudentValidation.safeParse(body);

        if (!validation.success) {
            const errors = validation.error.errors.map((error) => ({ field: error.path[0], message: error.message }));
            return NextResponse.json({ success: false, message: "Validation error", errors }, { status: 400 });
        }

        const { name, rollNo, classId, section, parentEmail, dob, gender, bloodGroup, address, password } = validation.data;

        const classExists = await prisma.class.findFirst({ where: { id: classId } });
        if (!classExists) {
            return NextResponse.json({ success: false, message: "Invalid Class ID for this school" }, { status: 400 });
        }

        if (!classExists.sections.includes(section)) {
            return NextResponse.json({ success: false, message: `Section '${section}' does not exist in Class '${classExists.name}'` }, { status: 400 });
        }

        const schoolId = classExists.schoolId;

        const existingStudent = await prisma.student.findFirst({ where: { schoolId, classId, section, rollNo } });

        if (existingStudent) {
            return NextResponse.json({ success: false, message: `Student with Roll No ${rollNo} already exists in ${classExists.name} ${section}` }, { status: 409 });
        }

        const existingParent = await prisma.user.findUnique({ where: { email: parentEmail } });
        let parentId: string;

        if (existingParent) {
            parentId = existingParent.id;
        } else {
            const hashedPassword = await bcrypt.hash(password, 12);

            const newParent = await prisma.user.create({
                data: {
                    name: `Parent of ${name}`,
                    email: parentEmail,
                    password: hashedPassword,
                    role: "USER",
                    status: "ACTIVE",
                    address: address || ""
                }
            });
            parentId = newParent.id;
        }

        const newStudent = await prisma.student.create({
            data: {
                name, rollNo, section, parentEmail, schoolId, classId, parentId,
                dob: dob ? new Date(dob) : null, gender, bloodGroup, address, isActive: false
            }
        });

        return NextResponse.json({ success: true, message: "Student created successfully", student: newStudent }, { status: 201 });

    } catch (error) {
        console.error("Create Student Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
})