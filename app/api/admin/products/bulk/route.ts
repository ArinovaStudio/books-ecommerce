import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { verifyAdmin } from "@/lib/verify";
import { parse } from "csv-parse/sync";

const bulkProductRowSchema = z.object({
    name: z.string({ required_error: "Product Name is required" }).min(1),
    description: z.string({ required_error: "Description is required" }).min(1),
    price: z.preprocess((val) => Number(val), z.number().min(0, "Price must be positive")),
    category: z.string({ required_error: "Category is required" }).min(1),
    brand: z.string({ required_error: "Brand is required" }).min(1),
    stock: z.preprocess((val) => (val ? Number(val) : 100), z.number().int().nonnegative()),
    minQuantity: z.preprocess((val) => (val ? Number(val) : 1), z.number().int().min(1))
});

const ALLOWED_CATEGORIES = ["TEXTBOOK", "NOTEBOOK", "STATIONARY", "OTHER"];

export async function POST(req: NextRequest) {
    const auth = await verifyAdmin(req);
    if (!auth.success) {
        return NextResponse.json({ success: false, message: auth.message || "Unauthorized" }, { status: 403 });
    }

    if (auth.user.role !== "ADMIN") {
        return NextResponse.json({ success: false, message: "Only Admins can create global products" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const classId = formData.get("classId") as string;

    if (!file || !classId) {
        return NextResponse.json({ success: false, message: "File and Class ID are required" }, { status: 400 });
    }

    const classRecord = await prisma.class.findUnique({ where: { id: classId } });
    if (!classRecord) {
        return NextResponse.json({ success: false, message: "Invalid Class ID" }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const csvText = new TextDecoder().decode(fileBuffer);
    
    let records: any[] = [];
    try {
        records = parse(csvText, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
    } catch (e) {
        return NextResponse.json({ success: false, message: "Invalid CSV Format" }, { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const sendUpdate = (data: any) => {
                controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
            };

            sendUpdate({ type: "START", total: records.length, message: "Starting validation..." });

            let addedCount = 0;
            let errorCount = 0;

            for (let i = 0; i < records.length; i++) {
                const row = records[i];
                const rowNumber = i + 1;

                try {
                    const validation = bulkProductRowSchema.safeParse(row);
                    if (!validation.success) {
                        throw new Error(`Validation Error: ${validation.error.errors[0].message}`);
                    }
                    const data = validation.data;

                    const normalizedCategory = data.category.toUpperCase();
                    if (!ALLOWED_CATEGORIES.includes(normalizedCategory)) {
                        throw new Error(`Invalid Category: '${data.category}'. Allowed: ${ALLOWED_CATEGORIES.join(", ")}`);
                    }

                    await prisma.product.create({
                        data: {
                            name: data.name,
                            description: data.description,
                            price: data.price,
                            brand: data.brand || null,
                            category: normalizedCategory as "TEXTBOOK" | "NOTEBOOK" | "STATIONARY" | "OTHER",
                            stock: data.stock,
                            minQuantity: data.minQuantity,
                            classId: classId,
                            image: null 
                        }
                    });

                    addedCount++;
                    sendUpdate({ type: "PROGRESS", status: "SUCCESS", row: rowNumber, name: data.name, message: "Product added successfully" });

                } catch (error: any) {
                    errorCount++;
                    sendUpdate({ type: "PROGRESS", status: "ERROR", row: rowNumber, name: row.name || "Unknown", message: error.message || "Unknown error" });
                }
            }

            sendUpdate({ type: "COMPLETE", added: addedCount, failed: errorCount, message: "Bulk upload finished" });
            controller.close();
        }
    });

    return new NextResponse(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}