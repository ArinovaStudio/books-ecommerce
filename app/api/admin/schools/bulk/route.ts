import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { verifyAdmin } from "@/lib/verify";
import { parse } from "csv-parse/sync";
import { schoolAdminCreatedTemplate } from "@/lib/templates";
import sendEmail from "@/lib/email";
import { Wrapper } from "@/lib/api-handler";
 
const bulkSchoolRowSchema = z.object({
    name: z.string({ required_error: "School Name is required" }).min(1, "School Name is required"),
    email: z.string({ required_error: "Email is required" }).email("Invalid Email"),
    password: z.string({ required_error: "Password is required" }).min(6, "Password too short"),
    location: z.string({ required_error: "Location is required" }).min(1, "Location is required"),
    classRange: z.string({ required_error: "Class Range is required" }).min(1, "Class Range is required"),
    board: z.string({ required_error: "Board is required" }).min(1, "Board is required"),
    languages: z.string({ required_error: "Languages are required" }).min(1, "At least one language is required"),
});

function getClassNames(range: string): string[] {
  if (!range) return [];

  const normalized = range
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace("class", "")
    .replace("upto", "")
    .replace("-", "");

  const basics = ["Nursery", "PP I", "PP II"];
  const upTo8 = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
  const upTo10 = [...upTo8, "Class 9", "Class 10"];
  const upTo12 = [...upTo10, "Class 11", "Class 12"];

  switch (normalized) {
    case "8":
      return [...basics, ...upTo8];

    case "10":
      return [...basics, ...upTo10];

    case "12":
      return [...basics, ...upTo12];

    default:
      return [];
  }
}


export const POST = Wrapper(async (req: NextRequest) => {
    const auth = await verifyAdmin(req);
    if (!auth.success || auth.user.role !== "ADMIN") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ success: false, message: "CSV File is required" }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const csvText = new TextDecoder().decode(fileBuffer);
    
    let records: any[] = [];
    try {
        records = parse(csvText, {
            skip_empty_lines: true,
            trim: true,
        }).map((record: string[])=>{
            return {
                name: record[0],
                email: record[1],
                password: record[2],
                location: record[3],
                classRange: record[4],
                board: record[5],
                languages: record[6]
            }
        });
    } catch (e) {
        return NextResponse.json({ success: false, message: "Invalid CSV Format" }, { status: 400 });
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

                try {
                    const validation = bulkSchoolRowSchema.safeParse(row);
                    if (!validation.success) {
                        throw new Error(`Validation Error: ${validation.error.errors[0].message}`);
                    }
                    const data = validation.data;

                    const existingSchool = await prisma.school.findUnique({ where: { email: data.email } });
                    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });

                    if (existingSchool || existingUser) {
                        throw new Error(`Email '${data.email}' is already in use by a School or User.`);
                    }

                    let languages: string[] = ["English"];
                    try {
                        languages = JSON.parse(data.languages || '["English"]');
                    } catch {
                        if (data.languages && data.languages.includes(',')) {
                            languages = data.languages.split(',').map((l: string) => l.trim());
                        } else if (data.languages) {
                            languages = [data.languages];
                        }
                    }

                    const defaultLanguage = languages[0] || "English";

                    const currentYear = new Date().getFullYear();
                    const academicYear = `${currentYear}-${currentYear + 1}`;
                    const classesToCreate = getClassNames(data.classRange);

                    // Create School
                    const school = await prisma.school.create({
                        data: {
                            name: data.name,
                            email: data.email,
                            address: data.location,
                            classRange: data.classRange,
                            board: data.board,
                            languages: languages,
                            numberOfClasses: classesToCreate.length,
                            image: "",
                            status: "ACTIVE"
                        }
                    });

                    if (classesToCreate.length > 0) {
                        for (const className of classesToCreate) {
                            // Create Class Record
                            const newClass = await prisma.class.create({
                                data: {
                                    name: className,
                                    schoolId: school.id,
                                    academicYear: academicYear,
                                    sections: ["A"]
                                }
                            });

                            // Create Default Section "A"
                            await prisma.section.create({
                                data: {
                                    name: "A",
                                    language: defaultLanguage,
                                    classId: newClass.id
                                }
                            });
                        }
                    }

                    const hashedPassword = await bcrypt.hash(data.password, 12);
                    await prisma.user.create({
                        data: {
                            name: `${data.name} Admin`,
                            email: data.email,
                            password: hashedPassword,
                            role: "SUB_ADMIN",
                            schoolId: school.id,
                            status: "ACTIVE"
                        }
                    });

                    const emailData = schoolAdminCreatedTemplate(`${data.name} Admin`, data.email, data.password);
                    sendEmail(data.email, emailData.subject, emailData.html).catch(err => console.error(`Failed to send email to ${data.email}`, err));

                    addedCount++;
                    sendUpdate({ type: "PROGRESS", status: "SUCCESS", row: rowNumber, name: data.name, message: "School created successfully" });

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
})