import { NextRequest } from "next/server";
import * as arctic from "arctic";
import { cookies } from "next/headers";
import {API_STATUS_CODES} from "@/configs/api";

export async function GET(request: NextRequest): Promise<Response> {
    let tokens;
    let accessToken;

    const cookieStore = await cookies();
    const github = new arctic.GitHub(
        process.env.GITHUB_CLIENT_ID!,
        process.env.GITHUB_SECRET_KEY!,
        null,
    );
    const code = request.nextUrl.searchParams.get("code") as string;
    const state = request.nextUrl.searchParams.get("state") as string;
    const storedState = cookieStore.get('state')?.value as string;

    if (code === null || storedState === null || state !== storedState) {
        return new Response(null, {
            status: API_STATUS_CODES.ERROR.BAD_REQUEST,
        });
    }

    try {
        tokens = await github.validateAuthorizationCode(code ?? "");
        accessToken = tokens.accessToken();
    } catch (e) {
        if (e instanceof arctic.OAuth2RequestError) {
            // Invalid authorization code, credentials, or redirect URI
            const code = e.code;
            // ...
            console.error(code);
        }
        if (e instanceof arctic.ArcticFetchError) {
            // Failed to call `fetch()`
            const cause = e.cause;
            console.error(cause);
        }
        // Parse error
    }

    const response = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const user = await response.json();


    return Response.json({
        accessToken: accessToken,
        user: user,
    });
}