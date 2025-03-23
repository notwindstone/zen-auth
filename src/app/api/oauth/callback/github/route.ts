import { NextRequest } from "next/server";
import * as arctic from "arctic";
import {
    OAUTH2_API_ROUTES,
} from "@/configs/api";
import { redirect } from "next/navigation";
import { handleCallback } from "@/lib/routes/oauth/callback/handleCallback";

export async function GET(request: NextRequest): Promise<Response> {
    const provider = new arctic.GitHub(
        process.env.GITHUB_CLIENT_ID!,
        process.env.GITHUB_SECRET_KEY!,
        null,
    );
    const fetchUserProfile = async (accessToken: string): Promise<Response> => {
        return await fetch(OAUTH2_API_ROUTES.GITHUB.USER, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    };

    return redirect(await handleCallback({
        request,
        provider,
        fetchUserProfile,
    }));
}