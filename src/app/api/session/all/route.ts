import type { NextRequest } from "next/server";
import { COOKIES_KEY } from "@/configs/constants";
import { invalidateAllSessionsExceptCurrent, validateSessionToken } from "@/lib/actions/session";
import { getSession } from "@/lib/routes/session/getSession";
import { API_STATUS_CODES } from "@/configs/api";

export async function GET(request: NextRequest): Promise<Response> {
    const token = request.cookies.get(COOKIES_KEY)?.value ?? null;

    return getSession({
        token,
    });
}

export async function DELETE(request: NextRequest): Promise<Response> {
    const token = request.cookies.get(COOKIES_KEY)?.value as string;
    const { session, user } = await validateSessionToken({ token });

    if (session === null || user === null) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.FORBIDDEN,
        });
    }

    await invalidateAllSessionsExceptCurrent({
        userId: user.id,
        sessionId: session.id,
    });

    return new Response(null, {
        status: API_STATUS_CODES.SUCCESS.OK,
    });
}