import { NextRequest } from "next/server";
import { getIpAddress } from "@/utils/secure/getIpAddress";
import { API_STATUS_CODES } from "@/configs/api";
import { createResetToken, getResetToken, removeResetToken } from "@/lib/actions/reset";
import { generateResetToken } from "@/utils/secure/generateResetToken";
import { checkUserExistence, updateUser } from "@/lib/actions/user";
import { types } from "node:util";
import { sendResetCodeEmail } from "@/lib/actions/email";
import { generateSecurePassword } from "@/utils/secure/generateSecurePassword";
import { DecrementResetRateLimit, GlobalRateLimit, RateLimit, ResetRateLimit } from "@/lib/ratelimit/ratelimit";
import { EMAIL_LENGTH_LIMIT, PASSWORD_LENGTH_LIMIT } from "@/configs/constants";
import validateEmail from "@/utils/secure/validateEmail";
import { validateTurnstileToken } from "next-turnstile";
import { v4 as uuid } from "uuid";

export async function POST(request: NextRequest): Promise<Response> {
    const routeRTLKey = request.nextUrl.pathname;
    const globalRTLResult = await GlobalRateLimit({
        route: routeRTLKey,
    });

    if (types.isNativeError(globalRTLResult)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    if (!globalRTLResult.success) {
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

    const rateLimitResult = await ResetRateLimit({
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
        await DecrementResetRateLimit({ token: email });

        return new Response(null, {
            status: API_STATUS_CODES.SERVER.NETWORK_AUTHENTICATION_REQUIRED,
        });
    }

    const userExistence = await checkUserExistence({
        username: email,
        email,
    });

    if (types.isNativeError(userExistence)) {
        await DecrementResetRateLimit({ token: email });

        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    if (userExistence === null) {
        await DecrementResetRateLimit({ token: email });

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
        await DecrementResetRateLimit({ token: email });

        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    const emailResponse = await sendResetCodeEmail({
        email,
        resetToken,
    });

    if (emailResponse.error) {
        await DecrementResetRateLimit({ token: email });

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
    const globalRTLResult = await GlobalRateLimit({
        route: routeRTLKey,
    });

    if (types.isNativeError(globalRTLResult)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    if (!globalRTLResult.success) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.SERVICE_UNAVAILABLE,
        });
    }

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
    // until secure password is successfully generated
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