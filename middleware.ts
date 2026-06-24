import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Onboarding gate: if already onboarded and trying to access /onboarding, redirect to dashboard
    if (path === "/onboarding" && token) {
      // We'll check onboarded status client-side since the token doesn't carry it
      // But redirect if coming from a callback
    }

    // Protect admin routes
    if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized({ token, req }) {
        const path = req.nextUrl.pathname;

        // Public routes
        if (
          path === "/" ||
          path.startsWith("/login") ||
          path.startsWith("/signup") ||
          path.startsWith("/auth") ||
          path.startsWith("/api/auth") ||
          path.startsWith("/api/register") ||
          path.startsWith("/api/waitlist")
        ) {
          return true;
        }

        // Everything else requires auth
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/orders/:path*",
    "/account/:path*",
    "/api/orders/:path*",
    "/api/profile/:path*",
    "/api/account/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
