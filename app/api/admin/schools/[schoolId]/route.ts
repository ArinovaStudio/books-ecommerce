import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { deleteImage, saveImage } from "@/lib/upload";
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

export const PUT = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ schoolId: string }> }) => {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { schoolId } = await params;
        
        const existingSchool = await prisma.school.findUnique({
            where: { id: schoolId },
            include: { subAdmins: { select: { id: true, email: true } } }
        });

        if (!existingSchool) return NextResponse.json({ success: false, message: "School not found" }, { status: 404 });

        const isSuperAdmin = auth.user.role === "ADMIN";
        const isOwner = auth.user.role === "SUB_ADMIN" && auth.user.schoolId === schoolId;
        if (!isSuperAdmin && !isOwner) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });

        const currentSubAdmin = existingSchool.subAdmins[0];
        const currentSubAdminId = currentSubAdmin?.id;

        const formData = await req.formData();

        const name = formData.get("name") as string;
        const emailRaw = formData.get("email") as string;
        const email = emailRaw ? emailRaw.trim() : "";
        const address = formData.get("location") as string;
        const classRange = formData.get("classes") as string;
        const languagesRaw = formData.get("languages") as string;
        const board = formData.get("board") as string;
        const imageFile = formData.get("image") as File | null;
        const password = formData.get("password") as string;

        const isEmailChanged = email && (email.toLowerCase() !== existingSchool.email.toLowerCase());

        if (isEmailChanged) {
            if (!password) {
                return NextResponse.json({ 
                    success: false, 
                    message: "Security Alert: You must provide a new password when changing the registered email address." 
                }, { status: 400 });
            }

            const duplicateSchool = await prisma.school.findFirst({
                where: { 
                    email: { equals: email, mode: 'insensitive' },
                    id: { not: schoolId } 
                }
            });
            if (duplicateSchool) return NextResponse.json({ success: false, message: "Email is already used by another school" }, { status: 409 });

            const duplicateUser = await prisma.user.findFirst({
                where: { 
                    email: { equals: email, mode: 'insensitive' },
                    id: currentSubAdminId ? { not: currentSubAdminId } : undefined 
                }
            });
            if (duplicateUser) return NextResponse.json({ success: false, message: "Email is already used by another user" }, { status: 409 });
        }

        let imageUrl = existingSchool.image;
        if (imageFile && imageFile.size > 0) {
            const newImageUrl = await saveImage(imageFile);
            if (existingSchool.image) await deleteImage(existingSchool.image);
            imageUrl = newImageUrl;
        }

        // Check if any language is used by any section
        const newLanguages: string[] = languagesRaw ? JSON.parse(languagesRaw) : existingSchool.languages;
        const oldLanguages: string[] = existingSchool.languages;
        const languagesToRemove = oldLanguages.filter(lang => !newLanguages.includes(lang));

        if (languagesToRemove.length > 0) {
            const usedSection = await prisma.section.findFirst({
                where: {
                    class: { schoolId: schoolId },
                    language: { in: languagesToRemove }
                },
                include: { class: true }
            });

            if (usedSection) {
                return NextResponse.json({
                    success: false,
                    message: `Cannot remove language '${usedSection.language}' because it is currently used in Class '${usedSection.class.name}' Section '${usedSection.name}'.`
                }, { status: 400 });
            }
        }

        const updatedSchool = await prisma.$transaction(async (tx) => {
            let newNumberOfClasses = existingSchool.numberOfClasses;
            const defaultLanguage = newLanguages.length > 0 ? newLanguages[0] : "English";

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
                    await Promise.all(classesToAdd.map(async (className) => {
                        const newClass = await tx.class.create({
                            data: {
                                name: className,
                                schoolId: schoolId,
                                academicYear: academicYear,
                                sections: ["A"]
                            }
                        });
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
                    name: name || existingSchool.name,
                    email: isEmailChanged ? email : undefined,
                    address: address || existingSchool.address,
                    classRange: classRange || existingSchool.classRange,
                    languages: newLanguages,
                    image: imageUrl,
                    numberOfClasses: newNumberOfClasses,
                    board: board || existingSchool.board,
                },
            });

            if (currentSubAdminId) {
                const userUpdateData: any = {};
                
                if (isEmailChanged) {
                    userUpdateData.email = email;
                }
                
                if (password) {
                    userUpdateData.password = await bcrypt.hash(password, 12);
                }

                if (Object.keys(userUpdateData).length > 0) {
                    await tx.user.update({
                        where: { id: currentSubAdminId },
                        data: userUpdateData
                    });
                }
            }

            return school;
        });

        return NextResponse.json({ success: true, message: "School updated successfully", school: updatedSchool }, { status: 200 });

    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ success: false, message: "Email already in use." }, { status: 409 });
        }
        console.error("Update School Error:", error);
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
});

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