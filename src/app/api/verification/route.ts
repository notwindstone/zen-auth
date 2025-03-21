import type { NextRequest } from "next/server";
import { API_STATUS_CODES } from "@/configs/api";
import { createVerificationCode, getVerificationCodes, removeVerificationCode } from "@/lib/actions/verification";
import { sendVerificationCodeEmail } from "@/lib/actions/email";
import { generateVerificationCode } from "@/utils/secure/generateVerificationCode";
import { types } from "node:util";
import { checkUserExistence, createUser } from "@/lib/actions/user";
import { generateSecurePassword } from "@/utils/secure/generateSecurePassword";
import { getIpAddress } from "@/utils/secure/getIpAddress";
import { DecrementVerificationRateLimit, RateLimit, VerificationRateLimit } from "@/lib/ratelimit/ratelimit";
import { CODE_DIGITS_COUNT, EMAIL_LENGTH_LIMIT, PASSWORD_LENGTH_LIMIT, USERNAME_LENGTH_LIMIT } from "@/configs/constants";
import validateEmail from "@/utils/secure/validateEmail";
import { validateTurnstileToken } from "next-turnstile";
import { v4 as uuid } from "uuid";

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
    const username = data?.username;
    const token = data?.token;

    if (!token) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.NETWORK_AUTHENTICATION_REQUIRED,
        });
    }

    if (!email || !username) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    if (email.length > EMAIL_LENGTH_LIMIT || username.length > USERNAME_LENGTH_LIMIT) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    const isValidEmail = validateEmail({ email });

    if (!isValidEmail) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    const rateLimitResult = await VerificationRateLimit({
        token: email,
    });

    if (types.isNativeError(rateLimitResult)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    if (!rateLimitResult.success) {
        const expirationTime = Number(rateLimitResult?.expirationTime);
        const currentTime = Date.now();
        const rtlTime = new Date(expirationTime - currentTime);
        const remainingSeconds = rtlTime.getMinutes() * 60 + rtlTime.getSeconds();
        const headers = new Headers({
            "Retry-After": remainingSeconds.toString(),
        });

        return new Response(null, {
            status: API_STATUS_CODES.ERROR.TOO_MANY_REQUESTS,
            headers: headers,
        });
    }

    const turnstileResponse = await validateTurnstileToken({
        token,
        secretKey: process.env.TURNSTILE_SECRET_KEY!,
        idempotencyKey: uuid(),
        sandbox: process.env.NODE_ENV === "development",
    });

    if (!turnstileResponse.success) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.NETWORK_AUTHENTICATION_REQUIRED,
        });
    }

    const userExistence = await checkUserExistence({
        username,
        email,
    });

    if (types.isNativeError(userExistence)) {
        await DecrementVerificationRateLimit({ token: email });

        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    if (userExistence !== null) {
        await DecrementVerificationRateLimit({ token: email });

        const headers = new Headers({
            "X-Zen-Auth-Conflict": userExistence,
        });

        return new Response(null, {
            status: API_STATUS_CODES.ERROR.CONFLICT,
            headers: headers,
        });
    }

    const code = generateVerificationCode();
    const databaseResponse = await createVerificationCode({
        email,
        code,
    });

    if (types.isNativeError(databaseResponse)) {
        await DecrementVerificationRateLimit({ token: email });

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
        await DecrementVerificationRateLimit({ token: email });

        const statusCode = ('statusCode' in emailResponse?.error)
            ? Number(emailResponse.error.statusCode)
            : API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR;

        return new Response(null, {
            status: statusCode,
        });
    }

    return Response.json({
        id: emailResponse?.data?.id,
    });
}

export async function PUT(request: NextRequest): Promise<Response> {
    const ipAddress = getIpAddress(request);
    const rateLimitResult = await RateLimit({
        token: ipAddress,
    });

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

    if (
        email.length > EMAIL_LENGTH_LIMIT
        || username.length > USERNAME_LENGTH_LIMIT
        || displayName.length > USERNAME_LENGTH_LIMIT
        || password.length > PASSWORD_LENGTH_LIMIT
        || code.length !== CODE_DIGITS_COUNT
    ) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    const isValidEmail = validateEmail({ email });

    if (!isValidEmail) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    const userExistence = await checkUserExistence({
        username,
        email,
    });

    if (types.isNativeError(userExistence)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    if (userExistence !== null) {
        const headers = new Headers({
            "X-Zen-Auth-Conflict": userExistence,
        });

        return new Response(null, {
            status: API_STATUS_CODES.ERROR.CONFLICT,
            headers: headers,
        });
    }

    const codesResponse = await getVerificationCodes({
        email,
    });

    if (types.isNativeError(codesResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    const existingCode = codesResponse?.[0]?.code;

    if (code !== existingCode) {
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

    const verificationDatabaseResponse = await removeVerificationCode({
        email,
        code,
    });

    if (types.isNativeError(verificationDatabaseResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.IM_A_TEAPOT,
        });
    }

    return new Response(null, {
        status: API_STATUS_CODES.SUCCESS.OK,
    });
}