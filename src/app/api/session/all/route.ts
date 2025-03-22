import type { NextRequest } from "next/server";
import { COOKIES_KEY } from "@/configs/constants";
import { invalidateAllSessionsExceptCurrent, validateSessionToken } from "@/lib/actions/session";
import { getAllSessions } from "@/lib/routes/session/getAllSessions";
import { API_STATUS_CODES } from "@/configs/api";
import { types } from "node:util";
import { ConfiguredLRUCacheRateLimit } from "@/lib/ratelimit/lrucache";

export async function GET(request: NextRequest): Promise<Response> {
    const routeRTLKey = request.nextUrl.pathname;
    const GlobalRTLResult = ConfiguredLRUCacheRateLimit(routeRTLKey);

    if (GlobalRTLResult) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.SERVICE_UNAVAILABLE,
        });
    }

    const token = request.cookies.get(COOKIES_KEY)?.value ?? null;

    return await getAllSessions({
        token,
    });
}

export async function DELETE(request: NextRequest): Promise<Response> {
    const routeRTLKey = request.nextUrl.pathname;
    const GlobalRTLResult = ConfiguredLRUCacheRateLimit(routeRTLKey);

    if (GlobalRTLResult) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.SERVICE_UNAVAILABLE,
        });
    }

    const token = request.cookies.get(COOKIES_KEY)?.value as string;
    const sessionValidationResponse = await validateSessionToken({ token });

    if (types.isNativeError(sessionValidationResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    const { session, user } = sessionValidationResponse;

    if (session === null || user === null) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.FORBIDDEN,
        });
    }

    const invalidationResponse = await invalidateAllSessionsExceptCurrent({
        userId: user.id,
        sessionId: session.id,
    });

    if (types.isNativeError(invalidationResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    return new Response(null, {
        status: API_STATUS_CODES.SUCCESS.OK,
    });
}