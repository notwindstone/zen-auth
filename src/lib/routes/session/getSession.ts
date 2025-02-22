"use server";

import { validateSessionToken } from "@/lib/actions/session";

export async function getSession({
    token,
}: {
    token: string | null;
}) {
    if (token === null) {
        return new Response(null, {
            status: 401,
        });
    }

    const { session, user } = await validateSessionToken(token);

    if (session === null) {
        return new Response(null, {
            status: 401,
        });
    }

    return Response.json({
        session,
        user,
    });
}