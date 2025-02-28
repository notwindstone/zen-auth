"use server";

import { db } from "@/db/db";
import { InsertUser, SelectUser, userTable } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { v4 as generateUUID } from 'uuid';
import { PUBLIC_AVATAR_URL } from "@/configs/constants";

export async function createUser({
    username,
    displayName,
    email,
    password,
}: {
    username: InsertUser['username'];
    displayName: InsertUser['displayName'];
    email: InsertUser['email'];
    password: InsertUser['password'];
}): Promise<InsertUser | Error> {
    const user: InsertUser = {
        id: generateUUID(),
        username,
        avatarUrl: PUBLIC_AVATAR_URL,
        displayName,
        email,
        password,
        createdAt: new Date(),
        lastSignedIn: new Date(),
    };

    try {
        await db.insert(userTable).values(user);
    } catch {
        return new Error("Internal server error.");
    }

    return user;
}

export async function getUser({
    login,
}: {
    login: SelectUser['email'] | SelectUser['username'];
}): Promise<Array<SelectUser>> {
    return db.select({
        id: userTable.id,
        username: userTable.username,
        email: userTable.email,
        displayName: userTable.displayName,
        avatarUrl: userTable.avatarUrl,
        password: userTable.password,
        createdAt: userTable.createdAt,
        lastSignedIn: userTable.lastSignedIn,
    }).from(userTable).where(
        or(
            eq(userTable.username, login),
            eq(userTable.email, login),
        ),
    );
}

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