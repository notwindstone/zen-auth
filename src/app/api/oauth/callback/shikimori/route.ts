import { NextRequest } from "next/server";
import { OAUTH2_API_ROUTES } from "@/configs/api";
import { redirect } from "next/navigation";
import { handleCallback } from "@/lib/routes/oauth/callback/handleCallback";
import { ShikimoriProvider } from "@/utils/providers/OAuth2Providers";

export async function GET(request: NextRequest): Promise<Response> {
    const provider = await ShikimoriProvider();
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