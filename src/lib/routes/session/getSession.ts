"use server";

import { validateSessionToken } from "@/lib/actions/session";
import { API_STATUS_CODES } from "@/configs/api";
import { types } from "node:util";

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

    const validationResponse = await validateSessionToken({ token });

    if (types.isNativeError(validationResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    const { session, user } = validationResponse;

    if (session === null) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.UNAUTHORIZED,
        });
    }

    return Response.json({
        session,
        user: {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
            email: user.email,
            createdAt: user.createdAt,
            lastSignedIn: user.lastSignedIn,
        },
    });
}