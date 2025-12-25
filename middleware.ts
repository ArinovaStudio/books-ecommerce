import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/unauthorized",
];

const roleHome: Record<"ADMIN" | "SUB_ADMIN" | "USER", string> = {
  ADMIN: "/admin",
  SUB_ADMIN: "/subadmin",
  USER: "/",
};

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname.toLowerCase();

  /* ---------------------------------------------
     1️⃣ Allow API & internal assets
  ---------------------------------------------- */
  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  /* ---------------------------------------------
     2️⃣ Read auth cookies
  ---------------------------------------------- */
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value as
    | "ADMIN"
    | "SUB_ADMIN"
    | "USER"
    | undefined;

  /* ---------------------------------------------
     3️⃣ Public routes handling
  ---------------------------------------------- */
  if (publicRoutes.includes(pathname)) {
    // 🔐 Logged in user should NOT see auth pages
    if (token && role) {
      return NextResponse.redirect(
        new URL(roleHome[role], req.url)
      );
    }
    // ❌ Not logged in → allow
    return NextResponse.next();
  }

  /* ---------------------------------------------
     4️⃣ Protected routes – not logged in
  ---------------------------------------------- */
  // if (!token || !role) {
  //   return NextResponse.redirect(new URL("/signin", req.url));
  // }

  /* ---------------------------------------------
     5️⃣ ADMIN – full access
  ---------------------------------------------- */
  if (role === "ADMIN") {
    return NextResponse.next();
  }

  /* ---------------------------------------------
     6️⃣ SUB_ADMIN rules
  ---------------------------------------------- */
  if (role === "SUB_ADMIN") {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(
        new URL("/", req.url)
      );
    }
    return NextResponse.next();
  }

  /* ---------------------------------------------
     7️⃣ USER rules
  ---------------------------------------------- */
  if (role === "USER") {
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/subadmin")
    ) {
      return NextResponse.redirect(
        new URL("/", req.url)
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico|css|js|woff|woff2|ttf)).*)",
  ],
};
