import { NextRequest } from "next/server";
import { API_STATUS_CODES } from "@/configs/api";
import { createResetToken, getResetToken, removeResetToken } from "@/lib/actions/reset";
import { generateResetToken } from "@/utils/secure/generateResetToken";
import { checkUserExistence, updateUser } from "@/lib/actions/user";
import { types } from "node:util";
import { sendResetCodeEmail } from "@/lib/actions/email";
import { generateSecurePassword } from "@/utils/secure/generateSecurePassword";
import { EMAIL_LENGTH_LIMIT, PASSWORD_LENGTH_LIMIT } from "@/configs/constants";
import validateEmail from "@/utils/secure/validateEmail";
import { validateTurnstileToken } from "next-turnstile";
import { v4 as uuid } from "uuid";
import { ConfiguredLRUCacheRateLimit, ResetLRUCacheRateLimit } from "@/lib/ratelimit/lrucache";

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

    const email = data?.email;
    const token = data?.token;

    if (!token) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.NETWORK_AUTHENTICATION_REQUIRED,
        });
    }

    if (!email) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    if (email.length > EMAIL_LENGTH_LIMIT) {
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

    if (ResetLRUCacheRateLimit.increment(email)) {
        const headers = new Headers({
            "Retry-After": "120",
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
        ResetLRUCacheRateLimit.decrement(email);

        return new Response(null, {
            status: API_STATUS_CODES.SERVER.NETWORK_AUTHENTICATION_REQUIRED,
        });
    }

    const userExistence = await checkUserExistence({
        username: email,
        email,
    });

    if (types.isNativeError(userExistence)) {
        ResetLRUCacheRateLimit.decrement(email);

        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    if (userExistence === null) {
        ResetLRUCacheRateLimit.decrement(email);

        return new Response(null, {
            status: API_STATUS_CODES.ERROR.NOT_FOUND,
        });
    }

    const resetToken = generateResetToken();
    const databaseResponse = await createResetToken({
        email,
        resetToken,
    });

    if (types.isNativeError(databaseResponse)) {
        ResetLRUCacheRateLimit.decrement(email);

        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    const emailResponse = await sendResetCodeEmail({
        email,
        resetToken,
    });

    if (emailResponse.error) {
        ResetLRUCacheRateLimit.decrement(email);

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

    const email = data?.email;
    const newPassword = data?.newPassword;
    const resetToken = data?.resetToken;

    if (!email || !newPassword || !resetToken) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    if (email.length > EMAIL_LENGTH_LIMIT || newPassword.length > PASSWORD_LENGTH_LIMIT) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    const resetTokenResponse = await getResetToken({
        email,
    });

    if (types.isNativeError(resetTokenResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    const existingResetToken = resetTokenResponse?.[0]?.resetToken;

    if (existingResetToken !== resetToken) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.UNAUTHORIZED,
        });
    }

    // Don't remove reset token from database
    // until user is successfully updated
    const securePasswordResponse = await generateSecurePassword({
        password: newPassword,
    });

    if (types.isNativeError(securePasswordResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    const userUpdateResponse = await updateUser({
        email,
        newPassword: securePasswordResponse.hash,
    });

    if (types.isNativeError(userUpdateResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    const resetTokenRemovalResponse = await removeResetToken({
        email,
        resetToken,
    });

    if (types.isNativeError(resetTokenRemovalResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.IM_A_TEAPOT,
        });
    }

    return new Response(null, {
        status: API_STATUS_CODES.SUCCESS.OK,
    });
}