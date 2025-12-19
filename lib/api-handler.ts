import { NextRequest, NextResponse } from "next/server";
import { trackRequest } from "@/lib/tracker";

type ApiHandler = (req: NextRequest, context: { params: Promise<any> }) => Promise<NextResponse>;

export function Wrapper(handler: ApiHandler) {
  return async (req: NextRequest, context: { params: Promise<any> }) => {
    
    trackRequest();

    try {
      return await handler(req, context);
    } catch (error) {
      console.error("Global API Error:", error);
      return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
  };
}