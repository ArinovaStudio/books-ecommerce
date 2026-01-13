import prisma from "@/lib/prisma";

export function trackRequest() {
    const now = new Date();
    now.setMinutes(0, 0, 0); 

    prisma.apiTraffic.upsert({
        where: { hour: now },
        update: { count: { increment: 1 } }, 
        create: { hour: now, count: 1 }      
    }).catch((err: Error) => console.error("Tracking Error:", err));
}