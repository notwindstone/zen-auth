import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { SelectUser, usersTable } from '@/db/schema';

export async function updateSessionId(email: SelectUser['email'], data: { sessionId: string; }) {
    await db.update(usersTable).set(data).where(eq(usersTable.email, email));
}

export async function updatePassword(email: SelectUser['email'], data: { password: string; salt: string; }) {
    await db.update(usersTable).set(data).where(eq(usersTable.email, email));
}
