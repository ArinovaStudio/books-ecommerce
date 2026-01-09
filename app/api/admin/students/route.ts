import { Wrapper } from "@/lib/api-handler";
import sendEmail from "@/lib/email";
import prisma from "@/lib/prisma";
import { studentAddedTemplate } from "@/lib/templates";
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
        // console.log(whereClause);
        

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
    name: z.string().min(1, "Student Name is required"),
    rollNo: z.string().min(1, "Roll Number is required"),
    classId: z.string().uuid("Invalid Class ID"),
    sectionId: z.string().uuid("Invalid Section ID"),
    firstLanguage: z.string().min(1, "First Language is required"),
    
    parentName: z.string().min(1, "Parent Name is required"),
    parentEmail: z.string().email("Invalid Parent Email"),
    password: z.string().optional(),
    dob: z.string().optional(),
    gender: z.string().optional(),
    bloodGroup: z.string().optional(),
    address: z.string().optional(),
});

export const POST = Wrapper(async (req: NextRequest) => {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
        }

        const body = await req.json();
        const validation = createStudentValidation.safeParse(body);

        if (!validation.success) {
            const errors = validation.error.errors.map((error) => ({ field: error.path[0], message: error.message }));
            return NextResponse.json({ success: false, message: "Validation error", errors }, { status: 400 });
        }

        const { 
            name, rollNo, classId, sectionId, firstLanguage,
            parentName, parentEmail, password,
            dob, gender, bloodGroup, 
            address
        } = validation.data;

        const section = await prisma.section.findUnique({
            where: { id: sectionId },
            include: { class: true }
        });

        if (!section) {
            return NextResponse.json({ success: false, message: "Invalid Section ID" }, { status: 404 });
        }

        if (section.classId !== classId) {
            return NextResponse.json({ success: false, message: "Selected section does not belong to this class" }, { status: 400 });
        }

        
        if (section.language.toLowerCase() !== firstLanguage.toLowerCase()) {
            return NextResponse.json({ 
                success: false, 
                message: `Language Mismatch: Section '${section.name}' is for '${section.language}' students, but you selected '${firstLanguage}'.` 
            }, { status: 400 });
        }

        const schoolId = section.class.schoolId;

        // Check for Duplicate Student
        const existingStudent = await prisma.student.findFirst({
            where: {
                schoolId,
                classId,
                sectionId,
                rollNo
            }
        });

        if (existingStudent) {
            return NextResponse.json({ success: false, message: `Student with Roll No ${rollNo} already exists in this class` }, { status: 409 });
        }

        // Handle Parent (Link or Create)
        const existingParent = await prisma.user.findUnique({ where: { email: parentEmail } });
        let parentId: string;
        let isNewParent = false;

        if (existingParent) {
            parentId = existingParent.id;
        } else {
            // Validate Password availability for new account
            if (!password || password.length < 6) {
                return NextResponse.json({ success: false, message: "Password is required (min 6 chars) for new parent registration" }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            // Create New Parent
            const newParent = await prisma.user.create({
                data: {
                    name: parentName,
                    email: parentEmail,
                    password: hashedPassword,
                    role: "USER",
                    status: "ACTIVE",
                    address,
                    schoolId: schoolId 
                }
            });
            parentId = newParent.id;
            isNewParent = true;
        }

        // Create Student
        const newStudent = await prisma.student.create({
            data: {
                name,
                rollNo,
                firstLanguage,
                schoolId,
                classId,
                sectionId, 
                section: section.name,
                parentId,
                parentEmail,
                dob: dob ? new Date(dob) : null,
                gender,
                bloodGroup,
                address,
                isActive: true 
            }
        });

        // Send Welcome Email
        const emailData = studentAddedTemplate(name, parentName, parentEmail, isNewParent ? password : undefined);
        await sendEmail(parentEmail, emailData.subject, emailData.html);

        return NextResponse.json({ success: true, message: "Student added successfully", student: newStudent }, { status: 201 });

    } catch (error) {
        console.error("Create Student Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
});