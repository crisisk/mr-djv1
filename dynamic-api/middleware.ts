import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if user has admin or designer role
    if (path.startsWith("/admin")) {
      const userRole = token?.role as string;

      if (!userRole || !["admin", "designer"].includes(userRole)) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Allow access to login page without authentication
        if (path === "/admin/login") {
          return true;
        }

        // Require authentication for all other admin routes
        if (path.startsWith("/admin")) {
          return !!token;
        }

        // Allow access to non-admin routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
