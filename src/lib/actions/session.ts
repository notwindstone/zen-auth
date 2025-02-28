"use server";

import { TableSessionType, TableUserType, sessionTable, userTable } from "@/db/schema";
import { db } from "@/db/db";
import { and, eq, not } from "drizzle-orm";
import getSessionId from "@/utils/secure/getSessionId";
import { getMonthForwardDate } from "@/utils/misc/getMonthForwardDate";

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
}): Promise<TableSessionType> {
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
    
    await db.insert(sessionTable).values(session);

    return session;
}

export async function validateSessionToken({
    token,
}: {
    token: string;
}): Promise<SessionValidationResult> {
    const sessionId = getSessionId({ token });
    const result = await db
        .select({ user: userTable, session: sessionTable })
        .from(sessionTable)
        .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
        .where(eq(sessionTable.id, sessionId));

    if (result.length < 1) {
        return {
            session: null,
            user: null,
        };
    }

    const { user, session } = result[0];

    if (Date.now() >= session.expiresAt.getTime()) {
        await db.delete(sessionTable).where(eq(sessionTable.id, session.id));

        return {
            session: null,
            user: null,
        };
    }

    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expiresAt = getMonthForwardDate();

        await db
            .update(sessionTable)
            .set({
                expiresAt: session.expiresAt,
            })
            .where(eq(sessionTable.id, session.id));
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
}): Promise<void> {
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function invalidateAllSessionsExceptCurrent({
    userId,
    sessionId,
}: {
    sessionId: TableSessionType['id'];
    userId: TableSessionType['userId'];
}): Promise<void> {
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
}

export async function queryAllSessions({
    userId,
}: {
    userId: TableSessionType['userId'];
}): Promise<Array<TableSessionType>> {
    return (await db.select({
        id: sessionTable.id,
        userId: sessionTable.userId,
        ipAddress: sessionTable.ipAddress,
        lastSignedIn: sessionTable.lastSignedIn,
        browser: sessionTable.browser,
        os: sessionTable.os,
        architecture: sessionTable.architecture,
        expiresAt: sessionTable.expiresAt,
    }).from(sessionTable).where(eq(sessionTable.userId, userId)));
}

export type SessionValidationResult =
    | { session: TableSessionType; user: TableUserType }
    | { session: null; user: null };
