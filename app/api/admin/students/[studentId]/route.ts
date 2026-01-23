import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { verifyAdmin } from '@/lib/verify';
import { Wrapper } from "@/lib/api-handler";
import { studentAddedTemplate } from "@/lib/templates";
import sendEmail from "@/lib/email";
import bcrypt from "bcryptjs";

const updateStudentValidation = z.object({
  name: z.string().optional(),
  rollNo: z.string().optional(),
  classId: z.string().uuid().optional(),
  sectionId: z.string().uuid().optional(),
  firstLanguage: z.string().optional(),
  parentEmail: z.string().email().optional(),
  parentName: z.string().optional(), 
  password: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  isActive: z.boolean().optional(),
});

// UPDATE Student Details
export const PUT = Wrapper(async( req: NextRequest, { params }: { params: Promise<{ studentId: string }> }) => {
  try {
    const auth = await verifyAdmin(req);
    if (!auth.success){
        return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
    }

    const user = auth.user;
    if (user.role === "SUB_ADMIN" && !user.schoolId) {
        return NextResponse.json({ success: false, message: "School Admin must be linked to a school" }, { status: 403 });
    }

    const { studentId } = await params;
    const body = await req.json();

    const validation = updateStudentValidation.safeParse(body);
    if (!validation.success) {
        const errors = validation.error.errors.map((error) => ({ field: error.path[0], message: error.message }));
        return NextResponse.json({ success: false, message: "Validation error", errors }, { status: 400 });
    }

    const existingStudent = await prisma.student.findUnique({ where: { id: studentId } });
    
    if (!existingStudent) {
        return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    if (user.role === "SUB_ADMIN" && existingStudent.schoolId !== user.schoolId) {
        return NextResponse.json({ success: false, message: "You can only manage students in your own school" }, { status: 403 });
    }

    const { 
        name, rollNo, classId, sectionId, firstLanguage, 
        parentEmail, parentName, password, 
        dob, gender, bloodGroup, 
        address, isActive 
    } = validation.data;

    let newSectionName = existingStudent.section;
    
    // Class/Section/Language Consistency Check
    if (classId || sectionId || firstLanguage) {
        const targetClassId = classId || existingStudent.classId;
        const targetLanguage = firstLanguage || existingStudent.firstLanguage;

        if (targetLanguage) {   
            const allSections = await prisma.section.findMany({
                where: { classId: targetClassId }
            })
            
            const sectionDetArray = allSections.filter((sec: any) => sec.language.toLowerCase() === targetLanguage?.toLowerCase());
            const sectionDetails = sectionDetArray[0];
            newSectionName = sectionDetails.name;
        }
        
    }

    // Duplicate Roll No Check
    if (rollNo || classId || sectionId) {
        const targetClass = classId || existingStudent.classId;
        const targetRoll = rollNo || existingStudent.rollNo;

        const duplicate = await prisma.student.findFirst({
            where: {
                schoolId: existingStudent.schoolId,
                classId: targetClass,
                sectionId: sectionId || existingStudent.sectionId,
                rollNo: targetRoll,
                id: { not: studentId }
            }
        });

        if (duplicate) {
             return NextResponse.json({ success: false, message: `Another student already has Roll No '${targetRoll}' in this section` }, { status: 409 });
        }
    }

    // Parent Update Logic (Link Existing or Create New)
    let newParentId = existingStudent.parentId;
    let isNewParentCreated = false;

    if (parentEmail && parentEmail !== existingStudent.parentEmail) {
        const parentUser = await prisma.user.findUnique({ where: { email: parentEmail } });
        
        if (parentUser) {
            newParentId = parentUser.id;
        } else {
            if (!password || password.length < 6) {
                return NextResponse.json({ success: false, message: "Password (min 6 chars) is required to create a new parent account" }, { status: 400 });
            }
            if (!parentName) {
                return NextResponse.json({ success: false, message: "Parent Name is required to create a new parent account" }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const newParent = await prisma.user.create({
                data: {
                    name: parentName,
                    email: parentEmail,
                    password: hashedPassword,
                    role: "USER",
                    status: "ACTIVE",
                    address,
                    schoolId: existingStudent.schoolId
                }
            });

            newParentId = newParent.id;
            isNewParentCreated = true;
        }
    }

    // Update Student
    const updatedStudent = await prisma.student.update({
        where: { id: studentId },
        data: { 
            name, 
            rollNo, 
            classId, 
            sectionId,
            section: newSectionName,
            firstLanguage,
            parentEmail, 
            parentId: newParentId,
            dob: dob ? new Date(dob) : undefined, 
            gender, 
            bloodGroup, 
            address,
            isActive 
        }
    });

    // Send Email if New Parent Created
    if (isNewParentCreated && parentEmail && password) {
        const studentName = name || existingStudent.name;
        const pName = parentName || "Parent";
        
        const studentDetails = await prisma.student.findUnique({
            where: { id: studentId },
            include: {
                school: { select: { name: true } },
                class: { select: { name: true } },
                sectionDetails: { select: { name: true } }
            }
        });

        if (studentDetails) {
            const emailData = studentAddedTemplate(
                studentName,
                pName,
                parentEmail,
                studentDetails.school.name,
                studentDetails.class.name,
                studentDetails.sectionDetails?.name || newSectionName,
                password
            );
            await sendEmail(parentEmail, emailData.subject, emailData.html);
        }
    }

    return NextResponse.json({ success: true, message: "Student updated successfully", student: updatedStudent }, { status: 200 });

  } catch (error) {
    console.error("Update Student Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
})


// DELETE Student Details
export const DELETE = Wrapper(async( req: NextRequest, { params }: { params: Promise<{ studentId: string }> }) => {
  try {
    const auth = await verifyAdmin(req);
    if (!auth.success){
        return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
    }

    const user = auth.user;
    const { studentId } = await params;

    const existingStudent = await prisma.student.findUnique({ where: { id: studentId } });
    if (!existingStudent) {
        return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    if (user.role === "SUB_ADMIN" && existingStudent.schoolId !== user.schoolId) {
        return NextResponse.json({ success: false, message: "You can only delete students in your own school" }, { status: 403 });
    }

    await prisma.student.delete({ where: { id: studentId } });

    return NextResponse.json({ success: true, message: "Student deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete Student Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
})

export const GET = Wrapper(async (
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) => {
  const auth = await verifyAdmin(req)
  if (!auth.success) {
    return NextResponse.json({ success: false }, { status: 403 })
  }

  const { studentId } = await params

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      parent: {
        select: { name: true, email: true }
      }
    }
  })

  if (!student) {
    return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true, student })
})
