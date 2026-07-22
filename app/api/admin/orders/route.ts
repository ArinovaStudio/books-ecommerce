import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/lib/verify";
import { getFullImageUrl } from "@/lib/upload";
import { Wrapper } from "@/lib/api-handler";

const ORDER_STATUS_VALUES = [
  "ORDER_PLACED",
  "PACKAGING_DONE",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;

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

    /* ✅ Get schoolId + pagination + search params from query */
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    if (!schoolId) {
      return NextResponse.json(
        { success: false, message: "schoolId is required" },
        { status: 400 }
      );
    }

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20)
    );
    const skip = (page - 1) * limit;

    const orderInclude = {
      user: true,
      students: {
        include: {
          student: {
            include: {
              parent: true,
              school: true,
              class: true,
              sectionDetails: true,
            },
          },
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
              description: true,
              category: true,
            },
          },
        },
      },
    } as const;

    /* ================= SEARCH BRANCH ================= */
    // NOTE: `mode: "insensitive"` is a Postgres/MongoDB-only Prisma feature.
    // If you're on MySQL/SQLite, drop the `mode` key — those default collations
    // are already case-insensitive and Prisma will error on the unsupported option.
    const search = searchParams.get("search");

    if (search) {
      const term = search.trim();

      const matchedStatuses = ORDER_STATUS_VALUES.filter((s) =>
        s.replace(/_/g, " ").toLowerCase().includes(term.toLowerCase())
      );

      const orConditions: any[] = [
        { id: { contains: term, mode: "insensitive" } },
        { phone: { contains: term, mode: "insensitive" } },
        { pincode: { contains: term, mode: "insensitive" } },
        { landmark: { contains: term, mode: "insensitive" } },
        { class: { contains: term, mode: "insensitive" } },
        { user: { name: { contains: term, mode: "insensitive" } } },
        { user: { email: { contains: term, mode: "insensitive" } } },
        { user: { phone: { contains: term, mode: "insensitive" } } },
        {
          students: {
            some: {
              student: { name: { contains: term, mode: "insensitive" } },
            },
          },
        },
        {
          items: {
            some: {
              product: { name: { contains: term, mode: "insensitive" } },
            },
          },
        },
      ];

      if (matchedStatuses.length) {
        orConditions.push({ status: { in: matchedStatuses } });
      }

      const searchWhere = {
        AND: [
          {
            students: {
              some: {
                student: { schoolId: schoolId },
              },
            },
          },
          { OR: orConditions },
        ],
      };

      const [orders, totalCount] = await Promise.all([
        prisma.order.findMany({
          where: searchWhere,
          include: orderInclude,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.order.count({ where: searchWhere }),
      ]);

      orders.forEach((order) => {
        order.items?.forEach((item) => {
          if (item.product?.image) {
            item.product.image = getFullImageUrl(item.product.image, req);
          }
        });
      });

      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json(
        {
          success: true,
          orders,
          pagination: {
            page,
            limit,
            totalCount,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
        { status: 200 }
      );
    }

    /* ================= NON-SEARCH BRANCH ================= */
    const where = {
      students: {
        some: {
          student: {
            schoolId: schoolId,
          },
        },
      },
    };

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: orderInclude,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    orders.forEach((order) => {
      order.items?.forEach((item) => {
        if (item.product?.image) {
          item.product.image = getFullImageUrl(item.product.image, req);
        }
      });
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      {
        success: true,
        orders,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
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