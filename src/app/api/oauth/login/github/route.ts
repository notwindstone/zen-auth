import { NextRequest } from "next/server";
import * as arctic from "arctic";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ConfiguredLRUCacheRateLimit } from "@/lib/ratelimit/lrucache";

export async function GET(request: NextRequest): Promise<Response> {
    const routeRTLKey = request.nextUrl.pathname;
    const GlobalRTLResult = ConfiguredLRUCacheRateLimit(routeRTLKey);

    if (!GlobalRTLResult) {
        const errorUrl = request.nextUrl.searchParams.get('error_url');

        return redirect(errorUrl + "?oauthRTL=true");
    }

    const cookieStore = await cookies();
    const github = new arctic.GitHub(
        process.env.GITHUB_CLIENT_ID!,
        process.env.GITHUB_SECRET_KEY!,
        null,
    );
    const state = arctic.generateState();
    const scopes = ["user:email"];
    const url = github.createAuthorizationURL(state, scopes);

    cookieStore.set("state", state, {
        secure: process.env.NODE_ENV === "production",
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10,
    });

    return redirect(url.toString());
}