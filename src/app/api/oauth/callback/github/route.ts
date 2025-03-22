import { NextRequest } from "next/server";
import * as arctic from "arctic";

export async function GET(request: NextRequest): Promise<Response> {
    let tokens;
    let accessToken;

    const github = new arctic.GitHub(
        process.env.GITHUB_CLIENT_ID!,
        process.env.GITHUB_SECRET_KEY!,
        null,
    );
    const code = request.nextUrl.searchParams.get("code");

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

    return Response.json({
        accessToken: accessToken,
    });
}