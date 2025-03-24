import type { NextRequest } from "next/server";
import { getSession } from "@/lib/routes/session/getSession";
import { COOKIES_KEY } from "@/configs/constants";
import { invalidateSession } from "@/lib/actions/session";
import { deleteSessionTokenCookie } from "@/lib/actions/cookies";
import getSessionId from "@/utils/secure/getSessionId";
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

    return await getSession({
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

    const token = request.cookies.get(COOKIES_KEY)?.value;

    if (!token) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.FORBIDDEN,
        });
    }

    const sessionId = getSessionId({ token });

    await deleteSessionTokenCookie();

    const invalidationResponse = await invalidateSession({ sessionId });

    if (types.isNativeError(invalidationResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    return new Response(null, {
        status: API_STATUS_CODES.SUCCESS.OK,
    });
}