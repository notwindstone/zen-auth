import { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
    return Response.json({
        pathname: request.nextUrl.pathname,
    });
}