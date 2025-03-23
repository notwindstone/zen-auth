import { NextRequest } from "next/server";
import * as arctic from "arctic";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
    API_ROUTES,
    OAUTH2_ERROR_BASE_PARAMS,
    OAUTH2_REDIRECT_ERROR_URL_PARAMS,
    OAUTH2_RTL_PARAMS,
} from "@/configs/api";
import { ConfiguredLRUCacheRateLimit } from "@/lib/ratelimit/lrucache";

export async function GET(request: NextRequest): Promise<Response> {
    const routeRTLKey = request.nextUrl.pathname;
    const errorUrl = request.nextUrl.searchParams.get(OAUTH2_REDIRECT_ERROR_URL_PARAMS);
    const GlobalRTLResult = ConfiguredLRUCacheRateLimit(routeRTLKey);

    if (GlobalRTLResult) {
        return redirect(errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_RTL_PARAMS}`);
    }

    const cookieStore = await cookies();
    const shikimori = new arctic.Shikimori(
        process.env.SHIKIMORI_CLIENT_ID!,
        process.env.SHIKIMORI_SECRET_KEY!,
        process.env.HOST_URL! + API_ROUTES.OAUTH.CALLBACK.SHIKIMORI,
    );
    const state = arctic.generateState();
    const url = shikimori.createAuthorizationURL(state);

    cookieStore.set("state", state, {
        secure: false,
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10,
    });
    cookieStore.set(OAUTH2_REDIRECT_ERROR_URL_PARAMS, errorUrl as string, {
        secure: process.env.NODE_ENV === "production",
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10,
    });

    return redirect(url.toString());
}