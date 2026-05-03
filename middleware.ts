import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    try {
        const path = request.nextUrl.pathname;
        const isAdminPath = path.startsWith("/admin");

        const token = request.cookies.get("token")?.value || "";
        const adminToken = request.cookies.get("admintoken")?.value || "";

        if (isAdminPath) {
            const isPublicAdminPath =
                path === "/admin/auth/login" ||
                path === "/admin/auth/signin";

            if (isPublicAdminPath && adminToken) {
                return NextResponse.redirect(new URL("/admin/homepage", request.nextUrl));
            }

            if (!isPublicAdminPath && !adminToken) {
                return NextResponse.redirect(new URL("/admin/auth/login", request.nextUrl));
            }

            return NextResponse.next();
        }

        const isPublicPath =
            path === "/" ||
            path === "/auth/signin" ||
            path === "/auth/login";

        if (isPublicPath && token) {
            return NextResponse.redirect(new URL("/homepage", request.nextUrl));
        }

        if (!isPublicPath && !token) {
            return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
        }

        return NextResponse.next();
    } catch (error) {
        console.log("Internal Server error => " + error);
        return NextResponse.json(
            { error: "Internal Server error = " + error },
            { status: 500 }
        );
    }
}

export const config = {
    matcher: [
        "/",
        "/admin/auth/login",
        "/admin/auth/signin",
        "/admin/homepage",
        "/auth/login",
        "/auth/signin",
        "/homepage",
    ],
};