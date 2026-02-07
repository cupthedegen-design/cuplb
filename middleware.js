export function middleware(request) {
  const allowedIp = "100.36.199.153";

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    "unknown";

  const pathname = new URL(request.url).pathname;

  // Protect admin page + admin API
  if (pathname === "/admin.html" || pathname.startsWith("/api/admin")) {
    if (ip !== allowedIp) {
      return new Response("Not Found", { status: 404 });
    }
  }

  return;
}

export const config = {
  matcher: ["/admin.html", "/api/admin"]
};
