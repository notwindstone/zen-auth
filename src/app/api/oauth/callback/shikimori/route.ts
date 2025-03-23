import { NextRequest } from "next/server";
import * as arctic from "arctic";
import { API_ROUTES, OAUTH2_API_ROUTES } from "@/configs/api";
import { redirect } from "next/navigation";
import { handleCallback } from "@/lib/routes/oauth/callback/handleCallback";

export async function GET(request: NextRequest): Promise<Response> {
    const provider = new arctic.Shikimori(
        process.env.SHIKIMORI_CLIENT_ID!,
        process.env.SHIKIMORI_SECRET_KEY!,
        process.env.HOST_URL! + API_ROUTES.OAUTH.CALLBACK.SHIKIMORI,
    );
    const fetchUserProfile = async (accessToken: string): Promise<Response> => {
        return await fetch(OAUTH2_API_ROUTES.SHIKIMORI.USER, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    };

    return redirect(await handleCallback({
        request,
        provider,
        providerName: "shikimori",
        fetchUserProfile,
    }));
}