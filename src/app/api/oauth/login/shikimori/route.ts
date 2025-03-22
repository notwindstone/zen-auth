import { NextRequest } from "next/server";
import * as arctic from "arctic";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function GET(request: NextRequest): Promise<Response> {
    const cookieStore = await cookies();
    const shikimori = new arctic.Shikimori(
        process.env.SHIKIMORI_CLIENT_ID!,
        process.env.SHIKIMORI_SECRET_KEY!,
        "https://localhost:3000/api/oauth/callback/shikimori",
    );
    const state = arctic.generateState();
    const url = shikimori.createAuthorizationURL(state);

    cookieStore.set("state", state, {
        secure: false,
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10,
    });

    return redirect(url.toString());
}