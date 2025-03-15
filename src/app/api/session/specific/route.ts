import type { NextRequest } from "next/server";
import { getIpAddress } from "@/utils/secure/getIpAddress";
import { API_STATUS_CODES } from "@/configs/api";
import { COOKIES_KEY } from "@/configs/constants";
import { invalidateSession } from "@/lib/actions/session";
import { getAllSessions } from "@/lib/routes/session/getAllSessions";
import { TableSessionType } from "@/db/schema";
import { RateLimit } from "@/lib/ratelimit/ratelimit";
import { types } from "node:util";

export async function DELETE(request: NextRequest): Promise<Response> {
    const ipAddress = getIpAddress(request);
    const rateLimitResult = await RateLimit({
        token: ipAddress,
    });

    if (types.isNativeError(rateLimitResult)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    if (!rateLimitResult.success) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.TOO_MANY_REQUESTS,
        });
    }

    let data;

    try {
        data = await request.json();
    } catch {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    const token = request.cookies.get(COOKIES_KEY)?.value as string;
    const allSessionsResponse = await getAllSessions({ token });

    if (!allSessionsResponse?.ok) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.UNAUTHORIZED,
        });
    }

    let allSessions: {
        sessions: TableSessionType[];
    };

    try {
        allSessions = await allSessionsResponse.json();
    } catch {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    const sessionId = data?.sessionId;

    if (!sessionId) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    for (const currentSession of allSessions.sessions) {
        if (currentSession.id === sessionId) {
            await invalidateSession({ sessionId });

            return new Response(null, {
                status: API_STATUS_CODES.SUCCESS.OK,
            });
        }
    }

    return new Response(null, {
        status: API_STATUS_CODES.ERROR.FORBIDDEN,
    });
}