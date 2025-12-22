import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";

export const GET = Wrapper(async (req: NextRequest) => {
  try {
    const auth = await verifyAdmin(req);
    if (!auth.success || auth.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const [
        totalUsers, 
        lastMonthUsersCount, 
        totalSchools, 
        lastMonthSchoolsCount, 
        totalOrders,
        totalRevenueResult,
        usersHistory,
        schoolsHistory,
        ordersHistory,
        trafficLogs 
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { createdAt: { lt: new Date(now.getFullYear(), now.getMonth(), 1) } } }),
        prisma.school.count(),
        prisma.school.count({ where: { createdAt: { lt: new Date(now.getFullYear(), now.getMonth(), 1) } } }),
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: "SUCCESS" } }),
        prisma.user.findMany({ where: { createdAt: { gte: sixMonthsAgo } }, select: { createdAt: true } }),
        prisma.school.findMany({ where: { createdAt: { gte: sixMonthsAgo } }, select: { createdAt: true } }),
        prisma.order.findMany({ where: { createdAt: { gte: sixMonthsAgo }, status: "SUCCESS" }, select: { createdAt: true, totalAmount: true } }),
        
        prisma.apiTraffic.findMany({
            where: { hour: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
            orderBy: { hour: 'asc' }
        })
    ]);

    const totalRevenue = totalRevenueResult._sum.totalAmount || 0;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const analyticsMap = new Map<string, { users: number, schools: number, revenue: number }>();

    for (let i = 0; i < 6; i++) {
        const d = new Date();
        d.setMonth(now.getMonth() - i);
        analyticsMap.set(monthNames[d.getMonth()], { users: 0, schools: 0, revenue: 0 });
    }

    const fillMap = (data: any[], key: 'users' | 'schools') => {
        data.forEach(item => {
            const m = monthNames[new Date(item.createdAt).getMonth()];
            if (analyticsMap.has(m)) {
                const entry = analyticsMap.get(m)!;
                entry[key]++;
                analyticsMap.set(m, entry);
            }
        });
    };

    fillMap(usersHistory, 'users');
    fillMap(schoolsHistory, 'schools');

    ordersHistory.forEach(order => {
        const m = monthNames[new Date(order.createdAt).getMonth()];
        if (analyticsMap.has(m)) {
            const entry = analyticsMap.get(m)!;
            entry.revenue += order.totalAmount;
            analyticsMap.set(m, entry);
        }
    });

    const analyticsData = Array.from(analyticsMap.entries()).map(([month, data]) => ({ month, ...data })).reverse();

    const engagementMap = new Map<string, number>();
    
    for (let i = 23; i >= 0; i--) {
        const d = new Date();
        d.setHours(now.getHours() - i);
        const key = `${d.getHours().toString().padStart(2, '0')}:00`;
        engagementMap.set(key, 0);
    }

    trafficLogs.forEach(log => {
        const d = new Date(log.hour);
        const key = `${d.getHours().toString().padStart(2, '0')}:00`;
        if (engagementMap.has(key)) {
            engagementMap.set(key, log.count);
        }
    });

    const engagementData = Array.from(engagementMap.entries())
        .map(([time, requests]) => ({ time, requests }));

    const totalRequests24h = trafficLogs.reduce((acc, curr) => acc + curr.count, 0);

    return NextResponse.json({
      success: true,
      stats: [
        { label: "Total Users", value: totalUsers.toLocaleString(), change: "All time" },
        { label: "Active Schools", value: totalSchools.toLocaleString(), change: "All time" },
        { label: "Total Revenue", value: "₹" + totalRevenue.toLocaleString(), change: "All time" },
        { label: "24h Requests", value: totalRequests24h.toLocaleString(), change: "Last 24h" },
      ],
      analyticsData,
      engagementData
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
});