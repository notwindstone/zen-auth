import type { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    console.log(username);

    return Response.json({
        username: username,
    });
}