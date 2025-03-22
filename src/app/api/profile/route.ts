import type { NextRequest } from "next/server";
import { getPublicProfile } from "@/lib/actions/user";
import { API_STATUS_CODES } from "@/configs/api";
import { types } from "node:util";
import { USERNAME_LENGTH_LIMIT } from "@/configs/constants";
import { ConfiguredLRUCacheRateLimit } from "@/lib/ratelimit/lrucache";

export async function GET(request: NextRequest): Promise<Response> {
    const routeRTLKey = request.nextUrl.pathname;
    const GlobalRTLResult = ConfiguredLRUCacheRateLimit(routeRTLKey);

    if (GlobalRTLResult) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.SERVICE_UNAVAILABLE,
        });
    }

    const searchParams = request.nextUrl.searchParams;
    const searchUsername = searchParams.get('username');

    if (searchUsername === null) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    if (searchUsername.length > USERNAME_LENGTH_LIMIT) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    const users = await getPublicProfile({ username: searchUsername });

    if (types.isNativeError(users)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    const user = users?.[0];

    if (!user) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.NOT_FOUND,
        });
    }

    const {
        username,
        displayName,
        avatarUrl,
        lastSignedIn,
        createdAt,
    } = user;

    return Response.json({
        user: {
            username,
            displayName,
            avatarUrl,
            lastSignedIn,
            createdAt,
        },
    });
}