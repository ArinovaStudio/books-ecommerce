import { Wrapper } from "@/lib/api-handler";
import sendEmail from "@/lib/email";
import prisma from "@/lib/prisma";
import { studentAddedTemplate } from "@/lib/templates";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET || "MY_SECRET_KEY";

export const POST = Wrapper(async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { parent, students, schoolInfo } = body;

    // console.log(students);
    
    if (!parent || !students?.length || !schoolInfo?.schoolId) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }
    const school = await prisma.school.findUnique({
      where: { id: schoolInfo.schoolId },
    });
    if (!school) {
      return NextResponse.json({
        success: false,
        message: "School Id is Invalid!",
      });
    }
    const result = await prisma.$transaction(async (tx) => {
      const schoolId = schoolInfo.schoolId;

      let parentUser = await tx.user.findUnique({
        where: { email: parent.email },
      });
      if (!parentUser) {
        if (!parent.password || parent.password.length < 8) {
          return NextResponse.json(
            {
              success: false,
              message: "Password required for new parent (min 8 chars)",
            },
            { status: 400 }
          );
        }

        const hashedPassword = await bcrypt.hash(parent.password, 12);

        parentUser = await tx.user.create({
          data: {
            name: parent.name,
            email: parent.email,
            password: hashedPassword,
            role: "USER",
            status: "ACTIVE",
            address: parent.address,
            phone: parent.phone,
            schoolId
          },
        });
      }

      // 3️⃣ Create students
      const createdStudents = [];

      for (const student of students) {
        const classInfo = await tx.class.findUnique({
          where: { id: student.class ,sectionDetails: {some:{id:student.sectionId}}},
        });
        // console.log(classInfo);
        
        if (!classInfo) {
          throw new Error(`Class Or Section Id Does not exist!`);
        }
      
        // Duplicate check
        const duplicate = await tx.student.findFirst({
          where: {
            schoolId,
            classId: student.class,
            sectionId: student.sectionId,
            rollNo: student.rollNo,
          },
        });

        if (duplicate) {
          throw new Error(
            `Roll No ${student.rollNo} already exists in section ${student.sectionId}`
          );
        }
        const section = await tx.section.findUnique({where:{id: student.sectionId}});
        if (!section) {
          throw new Error(`Section With Given Id Does Not Exist`);
        }
        const newStudent = await tx.student.create({
          data: {
            name: student.name,
            rollNo: student.rollNo,
            firstLanguage: student.language,
            schoolId,
            classId: student.class,
            sectionId: student.sectionId,
            section:section.name,
            parentEmail: parent.email,
            dob: student.dob ? new Date(student.dob) : null,
            gender: student.gender,
            bloodGroup: student.bloodGroup || null,
            address: parent.address,
            isActive: true,
            parentId: parentUser.id,
          },
        });

        createdStudents.push(newStudent);
      }
      const token = jwt.sign(
        { id: parentUser.id, email: parentUser.email, role: parentUser.role },
        SECRET_KEY,
        { expiresIn: "7d" }
      );

      const cookieStore = await cookies();

      cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: "lax"
      });

    });



    return NextResponse.json(
      {
        success: true,
        message: "Students added successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Bulk Student Create Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
});
