import type { NextRequest } from "next/server";
import { COOKIES_KEY } from "@/configs/constants";
import {cookies} from "next/headers";
import getSessionId from "@/utils/misc/getSessionId";
import {setSessionTokenCookie} from "@/lib/actions/cookies";

export async function GET(request: NextRequest): Promise<Response> {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    console.log(username);

    return Response.json({
        username: username,
    });
}