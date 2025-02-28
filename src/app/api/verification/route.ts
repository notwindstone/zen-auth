import type { NextRequest } from "next/server";
import { API_STATUS_CODES } from "@/configs/api";
import { generateVerificationCode } from "@/lib/actions/verification";
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
console.log(emailResponse);
    if (emailResponse.error) {
        return new Response(null, {
            status: API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR,
        });
    }

    return new Response(null, {
        status: API_STATUS_CODES.SUCCESS.OK,
    });
}