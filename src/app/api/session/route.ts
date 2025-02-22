import type { NextRequest } from "next/server";
import { getSession } from "@/lib/routes/session/getSession";

export async function GET(request: NextRequest): Promise<Response> {
    const token = request.cookies.get("zen_auth_session")?.value ?? null;

    return getSession({
        token,
    });
}