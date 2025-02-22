import type { NextRequest } from "next/server";
import { getSession } from "@/lib/routes/session/getSession";
import { COOKIES_KEY } from "@/configs/constants";

export async function GET(request: NextRequest): Promise<Response> {
    const token = request.cookies.get(COOKIES_KEY)?.value ?? null;

    return getSession({
        token,
    });
}