import type { NextRequest } from "next/server";
import { COOKIES_KEY } from "@/configs/constants";
import { invalidateAllSessionsExceptCurrent, validateSessionToken } from "@/lib/actions/session";
import { getAllSessions } from "@/lib/routes/session/getAllSessions";
import { API_STATUS_CODES } from "@/configs/api";
import { getIpAddress } from "@/utils/secure/getIpAddress";
import { generalRateLimit } from "@/lib/ratelimit/upstash";
import { types } from "node:util";

export async function GET(request: NextRequest): Promise<Response> {
    const ipAddress = getIpAddress(request);
    const rateLimitResult = await generalRateLimit.limit(ipAddress);

    if (!rateLimitResult.success) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.TOO_MANY_REQUESTS,
        });
    }

    const token = request.cookies.get(COOKIES_KEY)?.value ?? null;

    return await getAllSessions({
        token,
    });
}

export async function DELETE(request: NextRequest): Promise<Response> {
    const ipAddress = getIpAddress(request);
    const rateLimitResult = await generalRateLimit.limit(ipAddress);

    if (!rateLimitResult.success) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.TOO_MANY_REQUESTS,
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