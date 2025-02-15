import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { SelectUser, usersTable } from '@/db/schema';

export async function getUserEmail(email: SelectUser['email']): Promise<
    Array<{
        email: string;
    }>
> {
    return db.select({
        email: usersTable.email,
    }).from(usersTable).where(eq(usersTable.email, email));
}

export async function getSessionId(sessionId: SelectUser['sessionId']): Promise<
    Array<{
        sessionId: string;
    }>
> {
    return db.select({
        sessionId: usersTable.sessionId,
    }).from(usersTable).where(eq(usersTable.sessionId, sessionId));
}