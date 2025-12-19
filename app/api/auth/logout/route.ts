import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Wrapper } from "@/lib/api-handler";

export const POST = Wrapper(async() => {
  try {
    const cookieStore = await cookies();
    
    cookieStore.delete("token");

    return NextResponse.json({ success: true,message: "Logout successful" }, { status: 200 });
  } catch (error) {
    console.error("Logout Error:", error);
     return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
})