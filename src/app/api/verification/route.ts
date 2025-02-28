import type { NextRequest } from "next/server";
import { API_STATUS_CODES } from "@/configs/api";
import {generateVerificationCode, getVerificationCodes} from "@/lib/actions/verification";
import { sendEmail } from "@/lib/actions/email";

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

    const codes = await getVerificationCodes({
        email,
    });

    return Response.json({
        codes: codes.map((elem) => elem.code),
    });
}