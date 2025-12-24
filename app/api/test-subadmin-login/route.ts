import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const SECRET_KEY = process.env.JWT_SECRET || "MY_SECRET_KEY";

export async function GET() {
    try {
        const email = "subadmin@greenvalley.edu";
        const password = "subadmin123";

        const school = await prisma.school.findFirst({
            where: {
                email: email,
            },
        });

        if (!school) {
            return NextResponse.json(
                { success: false, message: "School not found" },
                { status: 404 }
            );
        }

        let subadmin = await prisma.user.findUnique({
            where: { email },
        });

        if (!subadmin) {
            const hashedPassword = await bcrypt.hash(password, 12);

            subadmin = await prisma.user.create({
                data: {
                    name: "Rahul SubAdmin",
                    email,
                    password: hashedPassword,
                    role: "SUB_ADMIN",
                    status: "ACTIVE",
                    phone: "9999999999",
                    address: "School Address",
                    school: {
                        connect: { id: school.id },
                    },
                },
            });
        }

        const token = jwt.sign(
            {
                id: subadmin.id,
                email: subadmin.email,
                role: subadmin.role,
                schoolId: school.id,
            },
            SECRET_KEY,
            { expiresIn: "1d" }
        );

        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return NextResponse.json({
            success: true,
            message: "Logged in as SubAdmin successfully",
            user: {
                email: subadmin.email,
                role: subadmin.role,
                schoolId: school.id,
            },
        });

    } catch (error: any) {
        console.error("SubAdmin Login Error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
