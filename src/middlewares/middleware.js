import { NextResponse } from "next/server";

export function middleware(request) {
  const role = request.cookies.get("role")?.value;

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Define the role-based access control rules
  const accessControl = {
    "/admin": ["ADMIN"],
    "/manager": ["MANAGER"],
    // Add more rules as needed
  };

  // Check if the path matches any restricted path
  for (const restrictedPath in accessControl) {
    if (path.startsWith(restrictedPath)) {
      const allowedRoles = accessControl[restrictedPath];
      if (!allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL("/403", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/manager/:path*"], // Apply the middleware to these paths
};
