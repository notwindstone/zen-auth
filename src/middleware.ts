import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIES_KEY } from "@/configs/constants";
import { API_STATUS_CODES } from "@/configs/api";

export async function middleware(request: NextRequest): Promise<NextResponse> {
    if (request.method === "GET") {
        const response = NextResponse.next();
        const token = request.cookies.get(COOKIES_KEY)?.value ?? null;

        if (token !== null) {
            response.cookies.set(COOKIES_KEY, token, {
                path: "/",
                maxAge: 60 * 60 * 24 * 30,
                sameSite: "lax",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            });
        }

        return response;
    }

    const originHeader = request.headers.get("Origin");
    const hostHeader = request.headers.get("Host");

    if (originHeader === null || hostHeader === null) {
        return new NextResponse(null, {
            status: API_STATUS_CODES.ERROR.FORBIDDEN,
        });
    }

    let origin: URL;

    try {
        origin = new URL(originHeader);
    } catch {
        return new NextResponse(null, {
            status: API_STATUS_CODES.ERROR.FORBIDDEN,
        });
    }

    if (origin.host !== hostHeader) {
        return new NextResponse(null, {
            status: API_STATUS_CODES.ERROR.FORBIDDEN,
        });
    }

    return NextResponse.next();
}
