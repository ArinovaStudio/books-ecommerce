import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ classId: string }> }) => {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        const { classId } = await params;

        const existingClass = await prisma.class.findUnique({
            where: { id: classId },
            include: {
                sectionDetails: {
                    orderBy: { name: 'asc' },
                    select: { id: true, name: true, language: true }
                }
            }
        });

        if (!existingClass) {
            return NextResponse.json({ success: false, message: "Class not found" }, { status: 404 });
        }

        // Sub-admin restriction
        if (auth.user.role === "SUB_ADMIN") {
            if (!auth.user.schoolId || auth.user.schoolId !== existingClass.schoolId) {
                return NextResponse.json({ success: false, message: "You are not authorized to view this school's classes" }, { status: 403 });
            }
        }

        return NextResponse.json({
            success: true,
            sections: existingClass.sectionDetails || []
        });

    } catch (error) {
        console.error("Get sections error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
});

// Add a new section
const addSectionSchema = z.object({
    section: z.string().min(1, "Section name is required"),
    language: z.string().min(1, "Language is required"),
});

export const POST = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ classId: string }> }) => {
    const auth = await verifyAdmin(req);
    if (!auth.success) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { classId } = await params;
    const body = await req.json();
    const validation = addSectionSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json({ success: false, message: "Validation error", errors: validation.error.errors[0].message }, { status: 400 });
    }

    const { section: name, language } = validation.data;

    const existingClass = await prisma.class.findUnique({ where: { id: classId } });
    if (!existingClass) {
        return NextResponse.json({ success: false, message: "Class not found" }, { status: 404 });
    }

    // Check for duplicate Name in this Class
    const duplicate = await prisma.section.findFirst({
        where: {
            classId,
            name: { equals: name, mode: 'insensitive' }
        }
    });

    if (duplicate) {
        return NextResponse.json({ success: false, message: `Section '${name}' already exists in this class` }, { status: 409 });
    }

    // Create Section & Update Class Array
    const newSection = await prisma.$transaction(async (tx) => {
        // Create Section Record
        const created = await tx.section.create({
            data: { name, language, classId }
        });

        await tx.class.update({
            where: { id: classId },
            data: { sections: { push: name } }
        });

        return created;
    });

    return NextResponse.json({ success: true, message: "Section added successfully", section: newSection });
});

// Update a section
const updateSectionSchema = z.object({
    sectionId: z.string().uuid("Invalid Section ID"),
    section: z.string().min(1, "Section name is required"),
    language: z.string().min(1, "Language is required"),
});

export const PUT = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ classId: string }> }) => {
    const auth = await verifyAdmin(req);
    if (!auth.success) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { classId } = await params;
    const body = await req.json();
    const validation = updateSectionSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json({ success: false, message: "Validation error", errors: validation.error.errors[0].message }, { status: 400 });
    }

    const { sectionId, section: name, language } = validation.data;

    // Verify ownership
    const existingSection = await prisma.section.findUnique({
        where: { id: sectionId },
        include: { class: true }
    });

    if (!existingSection || existingSection.classId !== classId) {
        return NextResponse.json({ success: false, message: "Section not found in this class" }, { status: 404 });
    }

    // Check for duplicate name
    if (name !== existingSection.name) {
        const duplicate = await prisma.section.findFirst({
            where: {
                classId,
                name: { equals: name, mode: 'insensitive' },
                id: { not: sectionId }
            }
        });
        if (duplicate) {
            return NextResponse.json({ success: false, message: `Section '${name}' already exists` }, { status: 409 });
        }
    }

    const updatedSection = await prisma.$transaction(async (tx) => {
        // Update Section
        const updated = await tx.section.update({
            where: { id: sectionId },
            data: { name, language }
        });

        const allSections = await tx.section.findMany({
            where: { classId },
            select: { name: true }
        });
        
        await tx.class.update({
            where: { id: classId },
            data: { sections: allSections.map(s => s.name) }
        });

        return updated;
    });

    return NextResponse.json({ success: true, message: "Section updated successfully", section: updatedSection });
});

// DELETE
const deleteSectionSchema = z.object({
    sectionId: z.string().uuid("Invalid Section ID"),
});

export const DELETE = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ classId: string }> }) => {
    const auth = await verifyAdmin(req);
    if (!auth.success) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { classId } = await params;
    const body = await req.json();
    const validation = deleteSectionSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json({ success: false, message: "Validation error", errors: validation.error.errors[0].message }, { status: 400 });
    }

    const { sectionId } = validation.data;

    const existingSection = await prisma.section.findUnique({
        where: { id: sectionId }
    });

    if (!existingSection || existingSection.classId !== classId) {
        return NextResponse.json({ success: false, message: "Section not found in this class" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
        await tx.section.delete({ where: { id: sectionId } });

        const allSections = await tx.section.findMany({
            where: { classId },
            select: { name: true }
        });

        await tx.class.update({
            where: { id: classId },
            data: { sections: allSections.map(s => s.name) }
        });
    });

    return NextResponse.json({ success: true, message: "Section deleted successfully" });
});