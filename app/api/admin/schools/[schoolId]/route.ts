import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { deleteImage, getFullImageUrl, saveImage } from "@/lib/upload";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";

function getClassNames(range: string): string[] {
    const basics = ["Nursery", "LKG", "UKG"];
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

export const PUT = Wrapper(async(req: NextRequest, { params }: { params: Promise<{ schoolId: string }> }) => {
  try {
    const auth = await verifyAdmin(req);
    if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

    const { schoolId } = await params;
    const existingSchool = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!existingSchool) return NextResponse.json({ success: false, message: "School not found" }, { status: 404 });

    const isSuperAdmin = auth.user.role === "ADMIN";
    const isOwner = auth.user.role === "SUB_ADMIN" && auth.user.schoolId === schoolId;
    if (!isSuperAdmin && !isOwner) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });

    const formData = await req.formData();
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const address = formData.get("location") as string; 
    const classRange = formData.get("classes") as string; 
    const languagesRaw = formData.get("languages") as string;
    const imageFile = formData.get("image") as File | null;

    let imageUrl = existingSchool.image;
    if (imageFile && imageFile.size > 0) {
      const newImageUrl = await saveImage(imageFile);
      if (existingSchool.image) await deleteImage(existingSchool.image);
      imageUrl = newImageUrl;
    }

    const updatedSchool = await prisma.$transaction(async (tx) => {
        let newNumberOfClasses = existingSchool.numberOfClasses;

        if (classRange && classRange !== existingSchool.classRange) {
            const expectedClasses = getClassNames(classRange);
            
            const currentClasses = await tx.class.findMany({
                where: { schoolId: schoolId },
                select: { name: true }
            });
            const currentClassNames = currentClasses.map(c => c.name);

            const classesToAdd = expectedClasses.filter(c => !currentClassNames.includes(c));
            
            const classesToDelete = currentClassNames.filter(c => !expectedClasses.includes(c));

            const currentYear = new Date().getFullYear().toString();
            const academicYear = `${currentYear}-${parseInt(currentYear) + 1}`;

            if (classesToAdd.length > 0) {
                await tx.class.createMany({
                    data: classesToAdd.map(className => ({
                        name: className,
                        schoolId: schoolId,
                        academicYear: academicYear,
                        sections: ["A"] 
                    }))
                });
            }

            if (classesToDelete.length > 0) {
                await tx.class.deleteMany({
                    where: { 
                        schoolId: schoolId,
                        name: { in: classesToDelete }
                    }
                });
            }

            newNumberOfClasses = expectedClasses.length;
        }

        const school = await tx.school.update({
            where: { id: schoolId },
            data: {
                name: name || existingSchool.name,
                email: email || existingSchool.email,
                address: address || existingSchool.address,
                classRange: classRange || existingSchool.classRange,
                languages: languagesRaw ? JSON.parse(languagesRaw) : existingSchool.languages,
                image: imageUrl,
                numberOfClasses: newNumberOfClasses
            },
        });

        return school;
    });

    return NextResponse.json({ success: true, message: "School updated successfully", school: updatedSchool }, { status: 200 });

  } catch (error) {
    console.error("Update School Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
})

export const DELETE = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ schoolId: string }> }) => {
  try {
    const auth = await verifyAdmin(req);
    if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

    const { schoolId } = await params;
    
    const existingSchool = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!existingSchool) return NextResponse.json({ success: false, message: "School not found" }, { status: 404 });

    if (auth.user.role !== "ADMIN") {
       return NextResponse.json({ success: false, message: "Only Admin can delete schools" }, { status: 403 });
    }

    if (existingSchool.image) {
      await deleteImage(existingSchool.image);
    }

    await prisma.$transaction(async (tx) => {
        await tx.user.deleteMany({
            where: { schoolId: schoolId, role: "SUB_ADMIN" }
        });

        await tx.school.delete({ where: { id: schoolId } });
    });

    return NextResponse.json({ success: true, message: "School and Admin deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete School Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
})