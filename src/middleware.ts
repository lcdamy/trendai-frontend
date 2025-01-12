import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/dashboard" || pathname === "/finance") {
    const url = request.nextUrl.clone();
    // return to the finance page
    url.pathname = "/dashboard/brand";
    return NextResponse.rewrite(url);
  }

  // return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/:path*",
};
