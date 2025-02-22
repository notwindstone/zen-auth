import { SelectSession, SelectUser, sessionTable, userTable } from "@/db/schema";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import getSessionId from "@/utils/misc/getSessionId";

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);

    crypto.getRandomValues(bytes);

    return encodeBase32LowerCaseNoPadding(bytes);

}

export async function createSession(token: string, userId: number): Promise<SelectSession> {
    const sessionId = getSessionId(token);
    const session: SelectSession = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    };
    
    await db.insert(sessionTable).values(session);

    return session;

}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = getSessionId(token);
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
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

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

export async function invalidateSession(sessionId: string): Promise<void> {
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function invalidateAllSessions(userId: number): Promise<void> {
    await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
}

export type SessionValidationResult =
    | { session: SelectSession; user: SelectUser }
    | { session: null; user: null };
