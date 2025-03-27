import { NextRequest, userAgent } from "next/server";
import { API_STATUS_CODES } from "@/configs/api";
import { getUser } from "@/lib/actions/user";
import { comparePasswords } from "@/utils/secure/comparePasswords";
import { createSession } from "@/lib/actions/session";
import { generateSessionToken } from "@/utils/secure/generateSessionToken";
import { getIpAddress } from "@/utils/secure/getIpAddress";
import { types } from "node:util";
import { EMAIL_LENGTH_LIMIT, PASSWORD_LENGTH_LIMIT } from "@/configs/constants";
import { ConfiguredLoginLRUCacheRateLimit, ConfiguredLRUCacheRateLimit } from "@/lib/ratelimit/lrucache";

export async function POST(request: NextRequest): Promise<Response> {
    const routeRTLKey = request.nextUrl.pathname;
    const GlobalRTLResult = ConfiguredLRUCacheRateLimit(routeRTLKey);

    if (GlobalRTLResult) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.SERVICE_UNAVAILABLE,
        });
    }

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
    // I was thinking for like 2 minutes why do i need this.
    // That's because we don't wanna people to brute force passwords
    const LoginRTLResult = ConfiguredLoginLRUCacheRateLimit(login ?? "");

    if (LoginRTLResult) {
        const headers = new Headers({
            "Retry-After": "1",
        });

        return new Response(null, {
            status: API_STATUS_CODES.ERROR.TOO_MANY_REQUESTS,
            headers: headers,
        });
    }

    const password = data?.password;

    if (!login || !password) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    if (login.length > EMAIL_LENGTH_LIMIT || password.length > PASSWORD_LENGTH_LIMIT) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    const users = await getUser({
        login,
    });

    if (types.isNativeError(users)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    const user = users?.[0];

    // Do we really need to handle incorrect login or password errors as
    // "Incorrect login/password provided"?
    // Why don't we just send user what is exactly wrong?
    // This is MUCH better in terms of UX with minimal security loss
    // Don't use emails for auth if that's the problem for you.
    // - inspired by https://pilcrowonpaper.com/blog/how-i-would-do-auth/
    if (!user) {
        const headers = new Headers({
            "X-Zen-Auth-Not-Found": "login",
        });

        return new Response(null, {
            status: API_STATUS_CODES.ERROR.NOT_FOUND,
            headers: headers,
        });
    }

    const isValid = await comparePasswords({
        hashedPassword: user.password,
        password: password,
    });

    if (!isValid) {
        const headers = new Headers({
            "X-Zen-Auth-Not-Found": "password",
        });

        return new Response(null, {
            status: API_STATUS_CODES.ERROR.NOT_FOUND,
            headers: headers,
        });
    }

    const {
        cpu,
        os,
        browser,
    } = userAgent(request);
    const ipAddress = getIpAddress(request);

    // sessionToken is NOT a sessionId
    const sessionToken = generateSessionToken();
    const sessionResponse = await createSession({
        token: sessionToken,
        userId: user.id,
        architecture: cpu?.architecture ?? "unknown",
        os: `${os?.name} ${os?.version}`,
        browser: `${browser?.name} ${browser?.version}`,
        ipAddress: ipAddress,
    });

    if (types.isNativeError(sessionResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    return Response.json({
        sessionToken: sessionToken,
    });
}
