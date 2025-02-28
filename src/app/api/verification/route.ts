import type { NextRequest } from "next/server";
import { API_STATUS_CODES } from "@/configs/api";
import { createVerificationCode, getVerificationCodes, removeVerificationCode } from "@/lib/actions/verification";
import { sendVerificationCodeEmail } from "@/lib/actions/email";
import { generateVerificationCode } from "@/utils/secure/generateVerificationCode";
import { types } from "node:util";
import { createUser } from "@/lib/actions/user";
import { generateSecurePassword } from "@/utils/secure/generateSecurePassword";
import { getIpAddress } from "@/utils/secure/getIpAddress";
import { ratelimit } from "@/lib/ratelimit/upstash";

export async function POST(request: NextRequest): Promise<Response> {
    // Yeah, these 18 lines of code are duplicated
    // But you can't really do anything with that
    const ipAddress = getIpAddress(request);
    const rateLimitResult = await ratelimit.limit(ipAddress);

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

    const email = data?.email;
    const username = data?.username;

    if (!email || !username) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    const code = generateVerificationCode();
    const databaseResponse = await createVerificationCode({
        email,
        code,
    });

    if (types.isNativeError(databaseResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    const emailResponse = await sendVerificationCodeEmail({
        code,
        email,
        username,
    });

    if (emailResponse.error) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    return Response.json({
        id: emailResponse?.data?.id,
    });
}

export async function PUT(request: NextRequest): Promise<Response> {
    const ipAddress = getIpAddress(request);
    const rateLimitResult = await ratelimit.limit(ipAddress);

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

    const username = data?.username;
    const displayName = data?.displayName;
    const email = data?.email;
    const password = data?.password;
    const code = data?.code;

    if (!email || !code || !username || !displayName || !password) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    const codesResponse = await getVerificationCodes({
        email,
    });
    const codes = new Set(codesResponse.map((elem: {
        code: string;
    }) => elem.code));

    if (!codes.has(code)) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.UNAUTHORIZED,
        });
    }

    // Don't remove verification code from database
    // until secure password is successfully generated
    const securePasswordResponse = await generateSecurePassword({
        password: password,
    });

    if (types.isNativeError(securePasswordResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    const verificationDatabaseResponse = await removeVerificationCode({
        email,
        code,
    });

    if (types.isNativeError(verificationDatabaseResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    const { hash } = securePasswordResponse;

    const userDatabaseResponse = await createUser({
        username,
        displayName,
        email,
        password: hash,
    });

    if (types.isNativeError(userDatabaseResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    return new Response(null, {
        status: API_STATUS_CODES.SUCCESS.OK,
    });
}