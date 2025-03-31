import { NextRequest } from "next/server";

export function getIpAddress(request: NextRequest): string {
    const requestIP = request.headers.get('x-forwarded-for');

    if (!requestIP || requestIP === "::ffff:127.0.0.1") {
        return '127.0.0.1';
    }

    return requestIP.split(',')?.[0];
}