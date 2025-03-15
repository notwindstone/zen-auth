import type { NextRequest } from "next/server";
import { getSession } from "@/lib/routes/session/getSession";
import { COOKIES_KEY } from "@/configs/constants";
import { invalidateSession } from "@/lib/actions/session";
import { deleteSessionTokenCookie } from "@/lib/actions/cookies";
import getSessionId from "@/utils/secure/getSessionId";
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

    return await getSession({
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