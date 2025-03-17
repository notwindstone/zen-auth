import { NextRequest, userAgent } from "next/server";
import { API_STATUS_CODES } from "@/configs/api";
import { getUser } from "@/lib/actions/user";
import { comparePasswords } from "@/utils/secure/comparePasswords";
import { createSession } from "@/lib/actions/session";
import { generateSessionToken } from "@/utils/secure/generateSessionToken";
import { getIpAddress } from "@/utils/secure/getIpAddress";
import { types } from "node:util";
import { RateLimit } from "@/lib/ratelimit/ratelimit";
import { EMAIL_LENGTH_LIMIT, PASSWORD_LENGTH_LIMIT } from "@/configs/constants";

export async function POST(request: NextRequest): Promise<Response> {
    const ipAddress = getIpAddress(request);
    const rateLimitResult = await RateLimit({
        token: ipAddress,
    });
    console.log(rateLimitResult);
    if (types.isNativeError(rateLimitResult)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    if (!rateLimitResult.success) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.TOO_MANY_REQUESTS,
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
    console.log(users);
    if (types.isNativeError(users)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    const user = users?.[0];

    const isValid = await comparePasswords({
        hashedPassword: user.password,
        password: password,
    });

    if (!isValid) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.UNAUTHORIZED,
        });
    }

    const {
        cpu,
        os,
        browser,
    } = userAgent(request);

    // sessionToken is NOT a sessionId
    const sessionToken = generateSessionToken();
    const sessionResponse = await createSession({
        token: sessionToken,
        userId: user.id,
        architecture: cpu.architecture as string,
        os: `${os.name} ${os.version}`,
        browser: `${browser.name} ${browser.version}`,
        ipAddress: ipAddress,
    });
    console.log(sessionResponse);
    if (types.isNativeError(sessionResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    return Response.json({
        sessionToken: sessionToken,
    });
}