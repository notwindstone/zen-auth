"use server";

import { InsertSession, SelectSession, SelectUser, sessionTable, userTable } from "@/db/schema";
import { db } from "@/db/db";
import { and, eq, not } from "drizzle-orm";
import getSessionId from "@/utils/misc/getSessionId";
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
    userId: number;
    ipAddress: string;
    architecture: string;
    browser: string;
    os: string;
}): Promise<SelectSession> {
    const sessionId = getSessionId({ token });
    const session: InsertSession = {
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

export async function invalidateAllSessionsExceptCurrent(sessionId: string, userId: number): Promise<void> {
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
    userId: number;
}): Promise<Array<Pick<SelectSession, "id">>> {
    return (await db.select({
        id: sessionTable.id,
    }).from(sessionTable).where(eq(sessionTable.userId, userId)));
}

export type SessionValidationResult =
    | { session: SelectSession; user: SelectUser }
    | { session: null; user: null };
