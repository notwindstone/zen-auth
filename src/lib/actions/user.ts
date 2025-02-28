"use server";

import { db } from "@/db/db";
import { TableUserType, userTable } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { v4 as generateUUID } from 'uuid';
import { PUBLIC_AVATAR_URL } from "@/configs/constants";

export async function createUser({
    username,
    displayName,
    email,
    password,
}: {
    username: TableUserType['username'];
    displayName: TableUserType['displayName'];
    email: TableUserType['email'];
    password: TableUserType['password'];
}): Promise<TableUserType | Error> {
    const user: TableUserType = {
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
    login: TableUserType['email'] | TableUserType['username'];
}): Promise<Array<TableUserType>> {
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

export async function checkUserExistence({
    username,
    email,
}: {
    username: TableUserType['username'];
    email: TableUserType['email'];
}): Promise<string | null> {
    const users = await db.select({
        username: userTable.username,
        email: userTable.email,
    }).from(userTable).where(
        or(
            eq(userTable.username, username),
            eq(userTable.email, email),
        ),
    );

    for (const user of users) {
        if (user.email === email) {
            return "email";
        }

        if (user.username === username) {
            return "username";
        }
    }

    return null;
}

export async function getPublicProfile({
    username,
}: {
    username: string;
}): Promise<
        Array<
            Pick<
                TableUserType, "username" | "avatarUrl" | "displayName" | "createdAt" | "lastSignedIn"
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