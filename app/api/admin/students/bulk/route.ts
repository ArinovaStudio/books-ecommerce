import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { verifyAdmin } from "@/lib/verify";
import { parse } from "csv-parse/sync";
import { studentAddedTemplate } from "@/lib/templates"; 
import sendEmail from "@/lib/email";
import { parseDate } from "@/lib/parseDate";

const bulkStudentRowSchema = z.object({
    name: z.string({ required_error: "Student Name is required" }).min(1),
    rollNo: z.string({ required_error: "Roll Number is required" }).min(1),
    parentName: z.string({ required_error: "Parent Name is required" }).min(1),
    parentEmail: z.string({ required_error: "Parent Email is required" }).min(1).email("Invalid Parent Email"),
    password: z.string().optional(), 
    firstLanguage: z.string({ required_error: "First Language is required" }).min(1),
    gender: z.string().optional(),
    dob: z.string().optional(),
    bloodGroup: z.string().optional(),
    address: z.string().optional(),
    section: z.string().optional(), // optional
});

export async function POST(req: NextRequest) {
    const auth = await verifyAdmin(req);
    if (!auth.success) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const classId = formData.get("classId") as string;
    const globalSectionId = formData.get("sectionId") as string; // optional

    if (!file || !classId) {
        return NextResponse.json({ success: false, message: "File and Class ID are required" }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const csvText = new TextDecoder().decode(fileBuffer);
    
    let records: any[] = [];
    try {
        records = parse(csvText, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
    } catch (e) {
        return NextResponse.json({ success: false, message: "Invalid CSV Format" }, { status: 400 });
    }

    let globalSection: any = null;
    if (globalSectionId) {
        globalSection = await prisma.section.findUnique({ where: { id: globalSectionId }, include: { class: true }});
        if (!globalSection) {
            return NextResponse.json({ success: false, message: "Invalid Section ID provided" }, { status: 400 });
        }
    }

    const classRecord = await prisma.class.findUnique({ where: { id: classId }, select: { schoolId: true }});
    if (!classRecord) {
        return NextResponse.json({ success: false, message: "Invalid Class ID" }, { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const sendUpdate = (data: any) => {
                controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
            };

            sendUpdate({ type: "START", total: records.length, message: "Starting validation..." });

            let addedCount = 0;
            let errorCount = 0;

            for (let i = 0; i < records.length; i++) {
                const row = records[i];
                const rowNumber = i + 1;
                let isNewParent = false;
                let finalPassword = "";

                try {
                    const validation = bulkStudentRowSchema.safeParse(row);
                    if (!validation.success) {
                        console.log(validation.error);
                        throw new Error(`Validation Error: ${validation.error.errors[0].message}`);
                    }
                    const data = validation.data;

                    let targetSection = globalSection;

                    if (!targetSection) {
                        if (!data.section) throw new Error("Section is missing in CSV");
                        
                        targetSection = await prisma.section.findFirst({
                            where: { classId, name: { equals: data.section, mode: 'insensitive' } },
                            include: { class: true }
                        });
                        
                        if (!targetSection) throw new Error(`Section '${data.section}' not found in this class.`);
                    }

                    // Student language check
                    if (targetSection.language.toLowerCase() !== data.firstLanguage.toLowerCase()) {
                        throw new Error(`Language Mismatch: Section '${targetSection.name}' is for '${targetSection.language}' students, but you selected '${data.firstLanguage}'.`);
                    }

                    // Check for duplicate student
                    const existingStudent = await prisma.student.findFirst({
                        where: {
                            classId,
                            sectionId: targetSection.id,
                            rollNo: data.rollNo
                        }
                    });
                    if (existingStudent) throw new Error(`Roll No ${data.rollNo} already exists in section ${targetSection.name}`);

                    await prisma.$transaction(async (tx) => {

                        let parentId = "";
                        const existingParent = await tx.user.findUnique({ where: { email: data.parentEmail } });

                        // Handle Parent (Link or Create)
                        if (existingParent) {
                            parentId = existingParent.id;

                        } else {
                            if (!data.password || data.password.length < 6) {
                                throw new Error("New parent requires a password (min 6 chars)");
                            }
                            finalPassword = data.password;
                            isNewParent = true;
                            
                            const hashedPassword = await bcrypt.hash(finalPassword, 10);
                            const newParent = await tx.user.create({
                                data: {
                                    name: data.parentName,
                                    email: data.parentEmail,
                                    password: hashedPassword,
                                    role: "USER",
                                    schoolId: classRecord.schoolId,
                                    address: data.address
                                }
                            });
                            parentId = newParent.id;
                        }

                        const parsedDob = parseDate(data.dob);

                        // Create Student
                        await tx.student.create({
                            data: {
                                name: data.name,
                                rollNo: data.rollNo,
                                classId: classId,
                                sectionId: targetSection.id,
                                section: targetSection.name,
                                schoolId: classRecord.schoolId,
                                parentId: parentId,
                                parentEmail: data.parentEmail,
                                firstLanguage: data.firstLanguage,
                                gender: data.gender || null,
                                dob: parsedDob || null,
                                bloodGroup: data.bloodGroup || null,
                                address: data.address,
                                isActive: true
                            }
                        });
                    });

                    if (isNewParent){
                        // Send Welcome Email
                        const emailData = studentAddedTemplate(data.name, data.parentName, data.parentEmail, isNewParent ? finalPassword : undefined);
                        sendEmail(data.parentEmail, emailData.subject, emailData.html).catch(err => console.error(`Failed to send email to ${data.parentEmail}`, err));
                    }

                    
                    addedCount++;
                    sendUpdate({ type: "PROGRESS", status: "SUCCESS", row: rowNumber, name: data.name, message: "Added successfully" });

                } catch (error: any) {
                    errorCount++;
                    sendUpdate({ type: "PROGRESS", status: "ERROR", row: rowNumber, name: row.name || "Unknown", message: error.message || "Unknown error" });
                }
            }

            sendUpdate({ type: "COMPLETE", added: addedCount, failed: errorCount, message: "Bulk upload finished" });
            controller.close();
        }
    });

    return new NextResponse(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}