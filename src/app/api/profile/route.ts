import type { NextRequest } from "next/server";
import { getPublicProfile } from "@/lib/actions/profile";
import { API_STATUS_CODES } from "@/configs/api";

export async function GET(request: NextRequest): Promise<Response> {
    const searchParams = request.nextUrl.searchParams;
    const searchUsername = searchParams.get('username');

    if (searchUsername === null) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    const users = await getPublicProfile({ username: searchUsername });
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
        username,
        displayName,
        avatarUrl,
        lastSignedIn,
        createdAt,
    });
}