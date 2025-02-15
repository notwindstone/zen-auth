import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { SelectUser, usersTable } from '@/db/schema';

export async function getUserEmail(email: SelectUser['email']): Promise<
    Array<{
        name: string;
        email: string;
    }>
> {
    return db.select({
        name: usersTable.name,
        email: usersTable.email,
    }).from(usersTable).where(eq(usersTable.email, email));
}

export async function getSessionId(email: SelectUser['email']): Promise<
    Array<{
        name: string;
        sessionId: string;
    }>
> {
    return db.select({
        name: usersTable.name,
        sessionId: usersTable.sessionId,
    }).from(usersTable).where(eq(usersTable.email, email));
}

export async function getHashedPassword(email: SelectUser['email']): Promise<
    Array<{
        hashedPassword: string;
    }>
> {
    return db.select({
        hashedPassword: usersTable.password,
    }).from(usersTable).where(eq(usersTable.email, email))
}