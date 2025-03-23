import { NextRequest } from "next/server";
import * as arctic from "arctic";
import { cookies } from "next/headers";
import {
    OAUTH2_API_ROUTES,
    OAUTH2_BAD_REQUEST_PARAMS,
    OAUTH2_REDIRECT_ERROR_URL_PARAMS,
    OAUTH2_INTERNAL_SERVER_ERROR_PARAMS,
    OAUTH2_ERROR_BASE_PARAMS,
} from "@/configs/api";
import { redirect } from "next/navigation";

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
    const errorUrl = cookieStore.get(OAUTH2_REDIRECT_ERROR_URL_PARAMS)?.value as string;

    if (code === null || storedState === null || state !== storedState) {
        return redirect(errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_BAD_REQUEST_PARAMS}`);
    }

    try {
        tokens = await github.validateAuthorizationCode(code);
        accessToken = tokens.accessToken();
    } catch (e) {
        console.error(e);

        return redirect(errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`);
    }

    const response = await fetch(OAUTH2_API_ROUTES.GITHUB.USER, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    let user;

    try {
        user = await response.json();
    } catch (e) {
        console.error(e);

        return redirect(errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`);
    }

    return Response.json({
        accessToken: accessToken,
        user: user,
    });
}