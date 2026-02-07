import { NextResponse } from "next/server";

const ALLOWED_IP = "100.36.199.153";

export function middleware(req) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.ip ||
    "unknown";

  const url = req.nextUrl.pathname;

  // Protect admin page and admin API
  if (url.startsWith("/admin") || url.startsWith("/api/admin")) {
    if (ip !== ALLOWED_IP) {
      return new NextResponse("Not Found", { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin.html", "/api/admin"]
};
