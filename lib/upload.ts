import { writeFile, unlink } from "fs/promises";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { NextRequest } from "next/server";

export async function saveImage(file: File): Promise<string> {
  if (!file) {
    throw new Error("No file provided");
  }

  const filename = file.name.toLowerCase();
  const extension = path.extname(filename);
  
  if (![".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(extension)) {
    throw new Error("Invalid image format");
  }

  const validMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validMimeTypes.includes(file.type)) {
    throw new Error("Invalid image format detected");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  const uniqueName = `${Date.now()}-${filename.replaceAll(" ", "_")}`;
  const filePath = path.join(uploadDir, uniqueName);

  await writeFile(filePath, buffer);

  return `/uploads/${uniqueName}`;
}

export async function deleteImage(fileUrl: string): Promise<boolean> {
  try {
    if (!fileUrl) return false;

    const filename = fileUrl.split("/uploads/")[1];
    
    if (!filename) return false;

    const filePath = path.join(process.cwd(), "public", "uploads", filename);

    await unlink(filePath);
    return true;

  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}

export function getFullImageUrl(path: string, req: NextRequest): string{
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const host = req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${protocol}://${host}`;
  return `${baseUrl}${path}`;
}