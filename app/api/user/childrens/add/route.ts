import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { childAddedTemplate, studentAddedTemplate } from "@/lib/templates";
import { verifyUser } from "@/lib/verify";
import sendEmail from "@/lib/email";
const ADMIN_EMAIL = process.env.EMAIL_USER!;
export const POST = Wrapper(async (req: NextRequest) => {
  try {
    const auth = await verifyUser(req);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message || "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = auth.user.id;
    const body = await req.json();

    const { name, rollNo, classId, language, gender, sectionId, section } =
      body;

    if (
      !name ||
      !rollNo ||
      !classId ||
      !language ||
      !gender ||
      !sectionId ||
      !section
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        school: true,
      },
    });
    if (!user) throw Error("Invalid User is trying to add children!");
    const school = user.school;

    let createdStudents: any = [];
    if (!school) {
      return NextResponse.json({
        success: false,
        message: "School Id is Invalid!",
      });
    }
    const schoolId = school.id;
    const classInfo = await prisma.class.findUnique({
      where: {
        id: classId,
        sectionDetails: { some: { id: sectionId } },
      },
    });
    if (!classInfo) {
      throw new Error(`Class Or Section Id Does not exist!`);
    }

    // Duplicate check
    const duplicate = await prisma.student.findFirst({
      where: {
        schoolId,
        classId: classId,
        sectionId: sectionId,
        rollNo: rollNo,
      },
    });
    const sectionInfo = await prisma.section.findUnique({
      where: { id: sectionId },
    });
    if (!sectionInfo) {
      throw new Error(`Section With Given Id Does Not Exist`);
    }
    if (duplicate) {
      throw new Error(
        `Roll No ${rollNo} already exists in section ${sectionInfo.name}`
      );
    }

    const newStudent = await prisma.student.create({
      data: {
        name: name,
        rollNo: rollNo,
        firstLanguage: language,
        schoolId,
        classId: classId,
        sectionId: sectionId,
        section: sectionInfo.name,
        parentEmail: user.email,
        dob: null,
        gender: gender,
        bloodGroup: null,
        address: user.address,
        isActive: true,
        parentId: user.id,
      },
      include: {
        class: true,
        parent: true,
      },
    });
    createdStudents.push(newStudent);

    for (let student of createdStudents) {
      const emailData = childAddedTemplate(
        school.name,
        user.name,
        student.name,
        student.class.name,
        student.section
      );
      await sendEmail(user.email, emailData.subject, emailData.html);
      const sendAdminEmail = studentAddedTemplate(
        student.name,
        user.name,
        user.email,
        school.name,
        classInfo.name,
        sectionInfo.name
      );

      await sendEmail(
        school.email,
        sendAdminEmail.subject,
        sendAdminEmail.html
      );

      await sendEmail(ADMIN_EMAIL, sendAdminEmail.subject, sendAdminEmail.html);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Student added successfully",
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
