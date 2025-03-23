"use server";

import { db } from "@/db/db";
import { TableUserType, userTable } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { v4 as generateUUID } from 'uuid';
import { PLACEHOLDER_STRING, PUBLIC_AVATAR_URL } from "@/configs/constants";

export async function createUser({
    username,
    displayName,
    email,
    password,
    id,
}: {
    username: TableUserType['username'];
    displayName: TableUserType['displayName'];
    email: TableUserType['email'];
    password: TableUserType['password'];
    id?: TableUserType['id'];
}): Promise<TableUserType | Error> {
    const user: TableUserType = {
        id: id ?? generateUUID(),
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

export async function updateUser({
    email,
    newPassword,
}: {
    email: TableUserType['email'];
    newPassword: TableUserType['password'];
}): Promise<string | Error> {
    try {
        await db.update(userTable).set({
            password: newPassword,
        }).where(eq(userTable.email, email));
    } catch {
        return new Error("Internal server error.");
    }

    return PLACEHOLDER_STRING;
}

export async function getUser({
    login,
}: {
    login: TableUserType['email'] | TableUserType['username'];
}): Promise<Array<TableUserType> | Error> {
    let result;

    try {
        result = await db.select({
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
    } catch {
        return new Error("Internal server error.");
    }

    return result;
}

export async function checkUserExistence({
    username,
    email,
}: {
    username: TableUserType['username'];
    email: TableUserType['email'];
}): Promise<{
    username: boolean;
    email: boolean;
} | null | Error> {
    let users;

    try {
        users = await db.select({
            username: userTable.username,
            email: userTable.email,
        }).from(userTable).where(
            or(
                eq(userTable.username, username),
                eq(userTable.email, email),
            ),
        );
    } catch {
        return new Error("Internal server error.");
    }

    const existingUser = {
        username: false,
        email: false,
        exists: false,
    };

    for (const user of users) {
        if (user.username === username) {
            existingUser.username = true;
            existingUser.exists = true;
        }

        if (user.email === email) {
            existingUser.email = true;
            existingUser.exists = true;
        }
    }

    if (existingUser.exists) {
        return existingUser;
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
        > | Error
> {
    let result;

    try {
        result = await db.select({
            username: userTable.username,
            avatarUrl: userTable.avatarUrl,
            displayName: userTable.displayName,
            createdAt: userTable.createdAt,
            lastSignedIn: userTable.lastSignedIn,
        }).from(userTable).where(eq(userTable.username, username));
    } catch {
        return new Error("Internal server error.");
    }

    return result;
}