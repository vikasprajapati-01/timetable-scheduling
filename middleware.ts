import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Public routes that don't require authentication
    if (path === "/" || path === "/auth/login" || path === "/auth/register") {
      return NextResponse.next()
    }

    // Redirect to login if not authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    // Role-based route protection
    const userRole = token.role as string

    // Admin routes
    if (path.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Head/Principal routes
    if (path.startsWith("/head") && !["head", "admin"].includes(userRole)) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Faculty routes
    if (path.startsWith("/faculty") && !["faculty", "head", "admin"].includes(userRole)) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Student routes
    if (path.startsWith("/student") && !["student", "faculty", "head", "admin"].includes(userRole)) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        
        // Allow access to public routes
        if (path === "/" || path === "/auth/login" || path === "/auth/register") {
          return true
        }

        // Require token for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}