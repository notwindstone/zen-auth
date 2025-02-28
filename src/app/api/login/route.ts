import type { NextRequest } from "next/server";
import { API_STATUS_CODES } from "@/configs/api";

export async function POST(request: NextRequest): Promise<Response> {
    let data;

    try {
        data = await request.json();
    } catch {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    // Login can either be a username or an email
    const login = data?.login;
    const password = data?.password;

    if (!login || !password) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }


}