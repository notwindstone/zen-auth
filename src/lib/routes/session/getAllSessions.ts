"use server";

import { API_STATUS_CODES } from "@/configs/api";
import { queryAllSessions, validateSessionToken } from "@/lib/actions/session";

export async function getAllSessions({
    token,
}: {
    token: string | null;
}) {
    if (token === null) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.UNAUTHORIZED,
        });
    }

    const { session, user } = await validateSessionToken({ token });

    if (session === null) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.UNAUTHORIZED,
        });
    }

    return Response.json({
        sessions: await queryAllSessions({ userId: user.id }),
    });
}