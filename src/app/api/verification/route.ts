import type { NextRequest } from "next/server";
import { API_STATUS_CODES } from "@/configs/api";
import { createVerificationCode, getVerificationCodes, removeVerificationCode } from "@/lib/actions/verification";
import { sendEmail } from "@/lib/actions/email";
import { generateVerificationCode } from "@/utils/misc/generateVerificationCode";
import { types } from "node:util";

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

    const emailResponse = await sendEmail({
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
    let data;

    try {
        data = await request.json();
    } catch {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    const email = data?.email;
    const code = data?.code;

    if (!email || !code) {
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

    const verificationDatabaseResponse = await removeVerificationCode({
        email,
        code,
    });

    if (types.isNativeError(verificationDatabaseResponse)) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    return new Response(null, {
        status: API_STATUS_CODES.SUCCESS.OK,
    });
}