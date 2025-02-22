import { validateSessionToken } from "@/lib/session";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
    const token = request.cookies.get("zen_auth_session")?.value ?? null;

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