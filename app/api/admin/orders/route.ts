import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/lib/verify";
import { getFullImageUrl } from "@/lib/upload";
import { Wrapper } from "@/lib/api-handler";

export const GET = Wrapper(async (req: NextRequest) => {
    try {
        const auth = await verifyUser(req);

        if (!auth.success || !auth.user) {
            return NextResponse.json(
                { success: false, message: auth.message || "Unauthorized" },
                { status: auth.status ?? 401 }
            );
        }

        if (!["ADMIN", "SUB_ADMIN"].includes(auth.user.role)) {
            return NextResponse.json(
                { success: false, message: "Forbidden: Admin access only" },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(req.url);
        const schoolId = searchParams.get("schoolId");

        if (!schoolId) {
            return NextResponse.json(
                { success: false, message: "schoolId is required" },
                { status: 400 }
            );
        }

        if (auth.user.role === "SUB_ADMIN" && auth.user.schoolId !== schoolId) {
            return NextResponse.json(
                { success: false, message: "Forbidden: You can only view orders for your own school" },
                { status: 403 }
            );
        }

        const orders = await prisma.order.findMany({
            where: {
                student: {
                    schoolId, 
                },
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    }
                },
                student: {
                    select: {
                        name: true,
                        rollNo: true,
                        section: true,
                        class: {
                            select: { name: true }
                        }
                    },
                },
                payment: {
                    select: {
                        amount: true,
                        status: true,
                        method: true,
                    },
                },
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                image: true,
                                price: true,
                                category: true
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        orders.forEach((order) => {
            order.items?.forEach((item) => {
                if (item.product?.image) {
                    item.product.image = getFullImageUrl(item.product.image, req);
                }
            });
        });

        return NextResponse.json(
            { success: true, orders },
            { status: 200 }
        );
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
});