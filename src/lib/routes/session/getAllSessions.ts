"use server";

import { API_STATUS_CODES } from "@/configs/api";
import { queryAllSessions, validateSessionToken } from "@/lib/actions/session";
import { TableSessionType } from "@/db/schema";
import { NextResponse } from "next/server";
import { types } from "node:util";

export async function getAllSessions({
    token,
}: {
    token: string | null;
}): Promise<NextResponse<{
    sessions: TableSessionType[];
}> | Response> {
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

    const allSessionsResponse = await queryAllSessions({ userId: user.id });

    if (types.isNativeError(allSessionsResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    return Response.json({
        sessions: allSessionsResponse,
        currentSessionId: session.id,
    });
}