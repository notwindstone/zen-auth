"use server";

import { db } from "@/db/db";
import { SelectUser, userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getPublicProfile({
    username,
}: {
    username: string;
}): Promise<
        Array<
            Pick<
                SelectUser, "username" | "avatarUrl" | "displayName" | "createdAt" | "lastSignedIn"
            > | undefined
        >
> {
    return (await db.select({
        username: userTable.username,
        avatarUrl: userTable.avatarUrl,
        displayName: userTable.displayName,
        createdAt: userTable.createdAt,
        lastSignedIn: userTable.lastSignedIn,
    }).from(userTable).where(eq(userTable.username, username)));
}