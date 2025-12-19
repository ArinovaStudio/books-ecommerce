import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { deleteImage, getFullImageUrl, saveImage } from "@/lib/upload";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";

export const PUT = Wrapper(async(req: NextRequest, { params }: { params: Promise<{ schoolId: string }> }) => {
  try {
    const auth = await verifyAdmin(req);

    if (!auth.success){
        return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
    }

    const { schoolId } = await params;

    if (!schoolId) {
      return NextResponse.json({ success: false, message: "School ID is required" }, { status: 400 });
    }

    const existingSchool = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!existingSchool) {
      return NextResponse.json({ success: false, message: "School not found" }, { status: 404 });
    }

    const isSuperAdmin = auth.user.role === "ADMIN";
    const isOwner = auth.user.role === "SUB_ADMIN" && auth.user.schoolId === schoolId;

    if (!isSuperAdmin && !isOwner) {
        return NextResponse.json({ success: false, message: "You can only manage your own school" }, { status: 403 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const board = formData.get("board") as string;
    const imageFile = formData.get("image") as File | null;
    const addressString = formData.get("address") as string; 
    let addressJson = JSON.parse(addressString);

    let imageUrl = existingSchool.image;
    if (imageFile) {
      const newImageUrl = await saveImage(imageFile);
      
      if (existingSchool.image) {
        await deleteImage(existingSchool.image);
      }
      imageUrl = newImageUrl;
    }

    const updatedSchool = await prisma.school.update({
      where: { id: schoolId },
      data: {
        name: name || existingSchool.name,
        board: board || existingSchool.board,
        address: addressJson || existingSchool.address,
        image: imageUrl,
      },
    });

    updatedSchool.image = getFullImageUrl(updatedSchool.image as string, req);

    return NextResponse.json({ success: true, message: "School updated successfully", school: updatedSchool }, { status: 200 });

  } catch (error) {
    console.error("Update School Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
})

export const DELETE = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ schoolId: string }> }) => {
  try {
    const auth = await verifyAdmin(req);

    if (!auth.success){
        return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
    }

    const { schoolId } = await params;

    if (!schoolId) {
      return NextResponse.json({ success: false, message: "School ID is required" }, { status: 400 });
    }

    const existingSchool = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!existingSchool) {
      return NextResponse.json({ success: false, message: "School not found" }, { status: 404 });
    }

    const isSuperAdmin = auth.user.role === "ADMIN";
    const isOwner = auth.user.role === "SUB_ADMIN" && auth.user.schoolId === schoolId;

    if (!isSuperAdmin && !isOwner) {
        return NextResponse.json({ success: false, message: "You can only manage your own school" }, { status: 403 });
    }

    if (existingSchool.image) {
      await deleteImage(existingSchool.image);
    }

    await prisma.school.delete({ where: { id: schoolId } });

    return NextResponse.json({ success: true, message: "School deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete School Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
})