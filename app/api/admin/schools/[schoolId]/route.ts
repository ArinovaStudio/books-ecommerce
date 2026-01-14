import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { deleteImage, getFullImageUrl, saveImage } from "@/lib/upload";
import { verifyAdmin } from "@/lib/verify";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

function getClassNames(range: string): string[] {
    const basics = ["Nursery", "PP I", "PP II"];
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
    const existingSchool = await prisma.school.findMany({ where: { id: schoolId }, include: {subAdmins: {select: {id: true, email: true, password: true}}}});
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
    const board = formData.get("board") as string;
    const imageFile = formData.get("image") as File | null;
    const password = formData.get("password") as string;
    
    let imageUrl = existingSchool[0].image;
    if (imageFile && imageFile.size > 0) {
      const newImageUrl = await saveImage(imageFile);
      if (existingSchool[0].image) await deleteImage(existingSchool[0].image);
      imageUrl = newImageUrl;
    }

    const updatedSchool = await prisma.$transaction(async (tx) => {
        let newNumberOfClasses = existingSchool[0].numberOfClasses;
        const currentLanguages = languagesRaw ? JSON.parse(languagesRaw) : existingSchool[0].languages;
        const defaultLanguage = currentLanguages.length > 0 ? currentLanguages[0] : "English";

        if (classRange && classRange !== existingSchool[0].classRange) {
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
                await Promise.all(classesToAdd.map(async (className) => {
                    // Create Class
                    const newClass = await tx.class.create({
                        data: {
                            name: className,
                            schoolId: schoolId,
                            academicYear: academicYear,
                            sections: ["A"] 
                        }
                    });

                    // Create Default Section
                    await tx.section.create({
                        data: {
                            name: "A",
                            language: defaultLanguage,
                            classId: newClass.id
                        }
                    });
                }));
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
                name: name || existingSchool[0].name,
                email: email || existingSchool[0].email,
                address: address || existingSchool[0].address,
                classRange: classRange || existingSchool[0].classRange,
                languages: languagesRaw ? JSON.parse(languagesRaw) : existingSchool[0].languages,
                image: imageUrl,
                numberOfClasses: newNumberOfClasses,
                board: board || existingSchool[0].board,
            },
        });

        if (email || password) {
          let hash = undefined
          if (password) {
            hash = await bcrypt.hash(password, 12)
          }
          await tx.user.update({
            where: {id: existingSchool[0].subAdmins[0].id},
            data: {
              email: email || existingSchool[0].subAdmins[0].email,
              password: hash || existingSchool[0].subAdmins[0].password
            }
          })
        }

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

    const schoolProducts = await prisma.product.findMany({
      where: { class: { schoolId } },
      select: { image: true }
    });

    // Delete all product images link to the school
    if (schoolProducts.length > 0) {
      await Promise.all(
        schoolProducts.map(async (product) => {
          if (product.image) {
            try {
              await deleteImage(product.image);
            } catch (err) {
              console.error("Failed to delete product image:", product.image, err);
            }
          }
        })
      );
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