import { NextRequest } from "next/server";

export function getIpAddress(request: NextRequest): string {
    return (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')?.[0];
}