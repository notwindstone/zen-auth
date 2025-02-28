"use server";

import { API_STATUS_CODES } from "@/configs/api";
import { queryAllSessions, validateSessionToken } from "@/lib/actions/session";
import { TableSessionType } from "@/db/schema";
import {NextResponse} from "next/server";

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