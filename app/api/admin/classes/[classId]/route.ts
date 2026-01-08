import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const updateClassValidation = z.object({
  name: z.string().optional(),
  
  sections: z.array(
    z.object({
        name: z.string().min(1, "Section Name is required"),
        language: z.string().min(1, "Language is required")
    })
  ).optional(),
  
  academicYear: z.string().optional()
});

export const PUT = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ classId: string }> }) => {
    try {
        const auth = await verifyAdmin(req);

        if (!auth.success){
            return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
        }

        const body = await req.json();

        const validation = updateClassValidation.safeParse(body);
        if (!validation.success) {
            const errors = validation.error.errors.map((error) => ({ field: error.path[0], message: error.message }));;
            return NextResponse.json({ success: false, message: "Validation error", errors }, { status: 400 });
        }

        const { name, sections, academicYear } = validation.data;
        const { classId } = await params;

        const existingClass = await prisma.class.findUnique({ where: { id: classId }});

        if (!existingClass) {
            return NextResponse.json( { success: false, message: "Class not found" }, { status: 404 });
        }

        // Sub admin check
        if (auth.user.role === "SUB_ADMIN") {
            if (!auth.user.schoolId || auth.user.schoolId !== existingClass.schoolId) {
                return NextResponse.json({ success: false, message: "You can only edit classes in your own school" }, { status: 403 });
            }
        }

        // Duplicate name check
        if (name) {
            const duplicate = await prisma.class.findFirst({
                where: {
                    schoolId: existingClass.schoolId,
                    name: { equals: name, mode: "insensitive" },
                    academicYear: academicYear || existingClass.academicYear,
                    id: { not: classId }
                }
            });

            if (duplicate) {
                return NextResponse.json({ success: false, message: "A class with this name already exists for this year" }, { status: 409 });
            }
        }

        const updatedClass = await prisma.$transaction(async (tx) => {
            
            const updateData: any = {};
            if (name) updateData.name = name;
            if (academicYear) updateData.academicYear = academicYear;
            
            if (sections) {
                updateData.sections = sections.map(s => s.name);
            }

            // Update the Class Record
            const updated = await tx.class.update({ 
                where: { id: classId }, 
                data: updateData 
            });

            if (sections && sections.length > 0) {
                for (const sectionData of sections) {
                    // Check if section exists by Name in this Class
                    const existingSection = await tx.section.findFirst({
                        where: {
                            classId: classId,
                            name: { equals: sectionData.name, mode: "insensitive" }
                        }
                    });

                    if (existingSection) {
                        // Update Language if changed
                        if (existingSection.language !== sectionData.language) {
                            await tx.section.update({
                                where: { id: existingSection.id },
                                data: { language: sectionData.language }
                            });
                        }
                    } else {
                        // Create New Section
                        await tx.section.create({
                            data: {
                                name: sectionData.name,
                                language: sectionData.language,
                                classId: classId
                            }
                        });
                    }
                }
            }

            return updated;
        });

        return NextResponse.json( { success: true, message: "Class updated successfully", class: updatedClass }, { status: 200 });

    } catch (error) {
        console.error("Update Class Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
})

export const DELETE = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ classId: string }> }) => {
    try {
        const auth = await verifyAdmin(req);

        if (!auth.success){
            return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
        }

        const { classId } = await params;

        if (!classId) {
            return NextResponse.json({ success: false, message: "Class ID is required" }, { status: 400 });
        }

        const existingClass = await prisma.class.findUnique({ where: { id: classId }});

        if (!existingClass) {
            return NextResponse.json({ success: false, message: "Class not found" }, { status: 404 });
        }

        if (auth.user.role === "SUB_ADMIN") {
            if (!auth.user.schoolId || auth.user.schoolId !== existingClass.schoolId) {
                return NextResponse.json({ success: false, message: "You can only edit classes in your own school" }, { status: 403 });
            }
        }

        const schoolId = existingClass.schoolId;

        await prisma.$transaction(async (tx) => {
            await tx.class.delete({ where: { id: classId }});

            await tx.school.update({ where: { id: schoolId }, data: { numberOfClasses: { decrement: 1 } } });
        })
        
        return NextResponse.json({ success: true, message: "Class deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Delete Class Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
})