import { SelectSession, SelectUser } from "@/db/schema";

export function generateSessionToken(): string {
}

export async function createSession(token: string, userId: number): Promise<SelectSession> {
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
