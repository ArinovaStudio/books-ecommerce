import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const token =  (await cookies()).get("token")?.value;
  console.log(token);
  

  return NextResponse.json({
    authenticated: Boolean(token),
  });
}
