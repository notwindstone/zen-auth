import type { NextRequest } from "next/server";
import { COOKIES_KEY } from "@/configs/constants";
import { invalidateAllSessionsExceptCurrent, validateSessionToken } from "@/lib/actions/session";
import { getSession } from "@/lib/routes/session/getSession";

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
            status: 403,
        });
    }

    await invalidateAllSessionsExceptCurrent(session.id, user.id);

    return new Response(null, {
        status: 200,
    });
}