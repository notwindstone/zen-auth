import { NextRequest } from "next/server";
import { getIpAddress } from "@/utils/secure/getIpAddress";
import { ratelimit } from "@/lib/ratelimit/upstash";
import { API_STATUS_CODES } from "@/configs/api";
import { createResetToken, getResetToken } from "@/lib/actions/reset";
import { generateResetToken } from "@/utils/secure/generateResetToken";
import { checkUserExistence, updateUser } from "@/lib/actions/user";
import { types } from "node:util";
import { sendResetCodeEmail } from "@/lib/actions/email";

export async function POST(request: NextRequest): Promise<Response> {
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

    if (!email) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    const userExistence = await checkUserExistence({
        username: email,
        email,
    });

    if (userExistence === null) {
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
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    const emailResponse = await sendResetCodeEmail({
        email,
        resetToken,
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

    const email = data?.email;
    const newPassword = data?.newPassword;
    const resetToken = data?.resetToken;

    if (!email || !newPassword || !resetToken) {
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

    const userUpdateResponse = await updateUser({
        email,
        newPassword,
    });

    if (types.isNativeError(userUpdateResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    return new Response(null, {
        status: API_STATUS_CODES.SUCCESS.OK,
    });
}