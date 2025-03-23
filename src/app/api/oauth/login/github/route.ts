import { NextRequest } from "next/server";
import * as arctic from "arctic";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ConfiguredLRUCacheRateLimit } from "@/lib/ratelimit/lrucache";
import {
    OAUTH2_ERROR_BASE_PARAMS,
    OAUTH2_REDIRECT_ERROR_URL_PARAMS,
    OAUTH2_RTL_PARAMS,
} from "@/configs/api";
import { GitHubProvider } from "@/utils/providers/OAuth2Providers";

export async function GET(request: NextRequest): Promise<Response> {
    const routeRTLKey = request.nextUrl.pathname;
    const errorUrl = request.nextUrl.searchParams.get(OAUTH2_REDIRECT_ERROR_URL_PARAMS);
    const GlobalRTLResult = ConfiguredLRUCacheRateLimit(routeRTLKey);

    if (GlobalRTLResult) {
        return redirect(errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_RTL_PARAMS}`);
    }

    const cookieStore = await cookies();
    const github = await GitHubProvider();
    const state = arctic.generateState();
    const scopes = ["user:email"];
    const url = github.createAuthorizationURL(state, scopes);

    const stateCookiesResponse = cookieStore.set("state", state, {
        secure: process.env.NODE_ENV === "production",
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10,
    });
    const errorUrlCookiesResponse = cookieStore.set(OAUTH2_REDIRECT_ERROR_URL_PARAMS, errorUrl as string, {
        secure: process.env.NODE_ENV === "production",
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10,
    });

    console.log(stateCookiesResponse, errorUrlCookiesResponse);

    return redirect(url.toString());
}