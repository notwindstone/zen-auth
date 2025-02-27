import type { NextRequest } from "next/server";
import { getPublicProfile } from "@/lib/actions/profile";

export async function GET(request: NextRequest): Promise<Response> {
    const searchParams = request.nextUrl.searchParams;
    const searchUsername = searchParams.get('username') as string;

    const users = await getPublicProfile({ username: searchUsername });
    const user = users?.[0];

    if (!user) {
        return new Response(null, {
            status: 401,
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