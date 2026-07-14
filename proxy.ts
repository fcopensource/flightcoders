import { NextRequest, NextResponse } from "next/server";

// Hostinger's edge cache can retain an older HTML document after a deploy. That
// document points at build-specific Next.js CSS chunks which no longer exist.
// Keep HTML fresh while allowing immutable /_next/static assets to cache safely.
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  if (request.method === "GET" && request.headers.get("accept")?.includes("text/html")) {
    response.headers.set("Cache-Control", "private, no-cache, no-store, max-age=0, must-revalidate");
    response.headers.set("CDN-Cache-Control", "no-store");
    response.headers.set("Surrogate-Control", "no-store");
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
