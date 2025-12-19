import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";

export const GET = Wrapper(async ( req: NextRequest) => {
  try {
    const auth = await verifyAdmin(req);
    if (!auth.success || auth.user.role !== "ADMIN") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const totalUsers = await prisma.user.count();
    const lastMonthUsers = await prisma.user.count({ where: { createdAt: { lt: startOfCurrentMonth } }});
    const userGrowth = lastMonthUsers === 0 ? 100 : ((totalUsers - lastMonthUsers) / lastMonthUsers) * 100;

    const totalSchools = await prisma.school.count();
    const lastMonthSchools = await prisma.school.count({ where: { createdAt: { lt: startOfCurrentMonth } }});
    const schoolGrowth = lastMonthSchools === 0 ? 100 : ((totalSchools - lastMonthSchools) / lastMonthSchools) * 100;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);
    
    const monthlyRegistrations = await prisma.user.groupBy({
        by: ['createdAt'],
        where: { createdAt: { gte: sixMonthsAgo } },
        _count: { id: true },
    });

    const chartMap = new Map<string, number>();
    monthlyRegistrations.forEach((entry) => {
        const month = entry.createdAt.toLocaleString('default', { month: 'short' });
        chartMap.set(month, (chartMap.get(month) || 0) + entry._count.id);
    });

    const userGrowthChart = Array.from(chartMap, ([name, value]) => ({ name, value }));

    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    const trafficLogs = await prisma.apiTraffic.findMany({
        where: { hour: { gte: yesterday } },
        orderBy: { hour: 'asc' }
    });

    const totalRequests24h = trafficLogs.reduce((acc, log) => acc + log.count, 0);

    const requestsMap = new Map<string, number>();
    
    for (let i = 0; i < 24; i++) {
        const d = new Date();
        d.setHours(d.getHours() - i);
        const key = `${d.getHours()}:00`;
        requestsMap.set(key, 0);
    }

    trafficLogs.forEach((log) => {
        const h = new Date(log.hour).getHours();
        const key = `${h}:00`;
        if (requestsMap.has(key)) {
            requestsMap.set(key, log.count);
        }
    });

    const requestsChart = [];
    for (let i = 23; i >= 0; i--) {
        const d = new Date();
        d.setHours(d.getHours() - i);
        const key = `${d.getHours()}:00`;
        requestsChart.push({
            time: key,
            count: requestsMap.get(key) || 0
        });
    }

    return NextResponse.json({
        success: true,
        summary: {
            users: { value: totalUsers, change: userGrowth.toFixed(1) + "%" },
            schools: { value: totalSchools, change: schoolGrowth.toFixed(1) + "%" },
            totalRequests: { value: totalRequests24h, change: "24h" }
        },
        charts: {
            userGrowth: userGrowthChart,
            recentActivity: requestsChart
        }
    }, { status: 200 });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
})