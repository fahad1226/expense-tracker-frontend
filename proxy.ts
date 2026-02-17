import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_TOKEN_KEY = "auth_token";

const protectedPaths = ["/dashboard", "/expenses"];

function isProtectedPath(pathname: string): boolean {
    return protectedPaths.some(
        (path) => pathname === path || pathname.startsWith(path + "/")
    );
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;

    // Protect dashboard and expenses routes
    if (isProtectedPath(pathname)) {
        if (!token) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    // Redirect logged-in users away from login page
    if (pathname === "/login" && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/expenses/:path*", "/login"],
};
