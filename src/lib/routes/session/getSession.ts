"use server";

import { queryAllSessions, validateSessionToken } from "@/lib/actions/session";
import { API_STATUS_CODES } from "@/configs/api";

export async function getSession({
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
        session,
        user,
    });
}

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