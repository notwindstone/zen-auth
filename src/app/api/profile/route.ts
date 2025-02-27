import type { NextRequest } from "next/server";

export async function GET(request: NextRequest,): Promise<Response> {
    console.log(request.nextUrl.searchParams.get('username'))

    return new Response(null, {
        status: 200,
    });
}