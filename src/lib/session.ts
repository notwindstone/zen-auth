import { SelectSession, SelectUser, sessionTable } from "@/db/schema";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { db } from "@/db/db";
import { sha256 } from "@oslojs/crypto/sha2";

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);

    crypto.getRandomValues(bytes);

    return encodeBase32LowerCaseNoPadding(bytes);

}

export async function createSession(token: string, userId: number): Promise<SelectSession> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: SelectSession = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    };
    
    await db.insert(sessionTable).values(session);

    return session;

}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
}

export async function invalidateSession(sessionId: string): Promise<void> {
}

export async function invalidateAllSessions(userId: number): Promise<void> {
}

export type SessionValidationResult =
    | { session: SelectSession; user: SelectUser }
    | { session: null; user: null };
