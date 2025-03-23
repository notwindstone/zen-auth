"use server";

import * as arctic from "arctic";
import { API_ROUTES } from "@/configs/api";

export const ShikimoriProvider = async () => {
    return new arctic.Shikimori(
        process.env.SHIKIMORI_CLIENT_ID!,
        process.env.SHIKIMORI_SECRET_KEY!,
        process.env.HOST_URL! + API_ROUTES.OAUTH.CALLBACK.SHIKIMORI,
    );
};

export const GitHubProvider = async () => {
    return new arctic.GitHub(
        process.env.GITHUB_CLIENT_ID!,
        process.env.GITHUB_SECRET_KEY!,
        null,
    );
};