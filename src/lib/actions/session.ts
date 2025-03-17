"use server";

import { TableSessionType, TableUserType, sessionTable, userTable } from "@/db/schema";
import { db } from "@/db/db";
import { and, eq, not } from "drizzle-orm";
import getSessionId from "@/utils/secure/getSessionId";
import { getMonthForwardDate } from "@/utils/misc/getMonthForwardDate";
import { PLACEHOLDER_STRING } from "@/configs/constants";

export async function createSession({
    token,
    userId,
    ipAddress,
    architecture,
    browser,
    os,
}: {
    token: string;
    userId: TableSessionType['userId'];
    ipAddress: TableSessionType['ipAddress'];
    architecture: TableSessionType['architecture'];
    browser: TableSessionType['browser'];
    os: TableSessionType['os'];
}): Promise<TableSessionType | Error> {
    const sessionId = getSessionId({ token });
    const session: TableSessionType = {
        id: sessionId,
        lastSignedIn: new Date(),
        ipAddress,
        architecture,
        browser,
        os,
        userId,
        expiresAt: getMonthForwardDate(),
    };
    
    try {
        await db.insert(sessionTable).values(session);
    } catch (error) {
        return new Error(`Internal server error. ${error}`);
    }

    return session;
}

export async function validateSessionToken({
    token,
}: {
    token: string;
}): Promise<SessionValidationResult | Error> {
    const sessionId = getSessionId({ token });
    let result;

    try {
        result = await db
            .select({ user: userTable, session: sessionTable })
            .from(sessionTable)
            .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
            .where(eq(sessionTable.id, sessionId));
    } catch {
        return new Error("Internal server error.");
    }

    if (result.length < 1) {
        return {
            session: null,
            user: null,
        };
    }

    const { user, session } = result[0];

    if (Date.now() >= session.expiresAt.getTime()) {
        try {
            await db
                .delete(sessionTable)
                .where(eq(sessionTable.id, session.id));
        } catch {
            return new Error("Internal server error.");
        }

        return {
            session: null,
            user: null,
        };
    }

    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expiresAt = getMonthForwardDate();

        try {
            await db
                .update(sessionTable)
                .set({
                    expiresAt: session.expiresAt,
                })
                .where(eq(sessionTable.id, session.id));
        } catch {
            return new Error("Internal server error.");
        }
    }

    return {
        session,
        user,
    };
}

export async function invalidateSession({
    sessionId,
}: {
    sessionId: string;
}): Promise<string | Error> {
    try {
        await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
    } catch {
        return new Error("Internal server error.");
    }

    return PLACEHOLDER_STRING;
}

export async function invalidateAllSessionsExceptCurrent({
    userId,
    sessionId,
}: {
    sessionId: TableSessionType['id'];
    userId: TableSessionType['userId'];
}): Promise<string | Error> {
    try {
        await db
            .delete(sessionTable)
            .where(
                and(
                    eq(sessionTable.userId, userId),
                    not(
                        eq(sessionTable.id, sessionId),
                    ),
                ),
            );
    } catch {
        return new Error("Internal server error.");
    }

    return PLACEHOLDER_STRING;
}

export async function queryAllSessions({
    userId,
}: {
    userId: TableSessionType['userId'];
}): Promise<Array<TableSessionType> | Error> {
    let result;

    try {
        result = await db.select({
            id: sessionTable.id,
            userId: sessionTable.userId,
            ipAddress: sessionTable.ipAddress,
            lastSignedIn: sessionTable.lastSignedIn,
            browser: sessionTable.browser,
            os: sessionTable.os,
            architecture: sessionTable.architecture,
            expiresAt: sessionTable.expiresAt,
        }).from(sessionTable).where(eq(sessionTable.userId, userId));
    } catch {
        return new Error("Internal server error.");
    }

    return result;
}

export type SessionValidationResult =
    | { session: TableSessionType; user: TableUserType }
    | { session: null; user: null };
