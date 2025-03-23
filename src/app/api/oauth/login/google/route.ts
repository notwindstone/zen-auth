import { NextRequest } from "next/server";
import * as arctic from "arctic";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function GET(request: NextRequest): Promise<Response> {
    const cookieStore = await cookies();
    const google = new arctic.Google(
        process.env.GOOGLE_CLIENT_ID!,
        process.env.GOOGLE_SECRET_KEY!,
        "https://localhost:3000/api/oauth/callback/google",
    );
    const state = arctic.generateState();
    const codeVerifier = arctic.generateCodeVerifier();
    const scopes = ["openid", "profile"];
    const url = google.createAuthorizationURL(state, codeVerifier, scopes);

    cookieStore.set("state", state, {
        secure: false,
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10,
    });

    console.log(request);
    return redirect(url.toString());
}