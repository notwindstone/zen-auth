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

    const email = data?.email;

    if (!email) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }



    return new Response(null, {
        status: API_STATUS_CODES.SUCCESS.OK,
    });
}