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

        /* ✅ Admin / Sub Admin only */
        if (!["ADMIN", "SUB_ADMIN"].includes(auth.user.role)) {
            return NextResponse.json(
                { success: false, message: "Forbidden: Admin access only" },
                { status: 403 }
            );
        }

        /* ✅ Get schoolId from query */
        const { searchParams } = new URL(req.url);
        const schoolId = searchParams.get("schoolId");

        if (!schoolId) {
            return NextResponse.json(
                { success: false, message: "schoolId is required" },
                { status: 400 }
            );
        }

        /* ✅ Fetch orders for a school */
        const orders = await prisma.order.findMany({
            where: {
                student: {
                    schoolId,
                },
            },
            include: {
                student: {
                    select: {
                        name: true,
                        rollNo: true,
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
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        /* ✅ Normalize product images */
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
