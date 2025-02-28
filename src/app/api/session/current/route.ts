import type { NextRequest } from "next/server";
import { getSession } from "@/lib/routes/session/getSession";
import { COOKIES_KEY } from "@/configs/constants";
import { invalidateSession } from "@/lib/actions/session";
import { deleteSessionTokenCookie } from "@/lib/actions/cookies";
import getSessionId from "@/utils/secure/getSessionId";
import { API_STATUS_CODES } from "@/configs/api";

export async function GET(request: NextRequest): Promise<Response> {
    const token = request.cookies.get(COOKIES_KEY)?.value ?? null;

    return getSession({
        token,
    });
}

export async function DELETE(request: NextRequest): Promise<Response> {
    const token = request.cookies.get(COOKIES_KEY)?.value as string;
    const sessionId = getSessionId({ token });

    await deleteSessionTokenCookie();
    await invalidateSession({ sessionId });

    return new Response(null, {
        status: API_STATUS_CODES.SUCCESS.OK,
    });
}