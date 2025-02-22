import { cookies } from "next/headers";
import { COOKIES_KEY } from "@/configs/constants";

export async function setSessionTokenCookie({
    token,
    expiresAt,
}: {
    token: string;
    expiresAt: Date;
}): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(COOKIES_KEY, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
        path: "/",
    });
}

export async function deleteSessionTokenCookie(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(COOKIES_KEY, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/",
    });
}