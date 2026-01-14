import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { limiter } from "./lib/rate-limit";

export async function middleware(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

    // 1. Rate Limiting Strategy
    // Apply strict limits to API routes and generic limits to others
    const isApiRoute = request.nextUrl.pathname.startsWith("/api");
    const limit = isApiRoute ? 10 : 50; // 10 req/min for API, 50 for pages

    try {
        const { isRateLimited, remaining } = limiter.check(limit, ip);

        if (isRateLimited) {
            return new NextResponse(
                JSON.stringify({ error: "Too Many Requests", retryAfter: 60 }),
                { status: 429, headers: { "Content-Type": "application/json" } }
            );
        }

        const response = NextResponse.next();

        // Add Rate Limit headers
        response.headers.set("X-RateLimit-Limit", limit.toString());
        response.headers.set("X-RateLimit-Remaining", remaining.toString());

        // 2. Security Headers (Harden security)
        response.headers.set("X-Content-Type-Options", "nosniff");
        response.headers.set("X-Frame-Options", "DENY");
        response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
        response.headers.set(
            "Content-Security-Policy",
            "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://*; connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com securetoken.googleapis.com;"
        );

        return response;
    } catch (error) {
        console.error("Middleware error", error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
