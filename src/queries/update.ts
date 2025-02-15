import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { SelectUser, usersTable } from '@/db/schema';

export async function updateSessionId(sessionId: SelectUser['sessionId']) {
    await db.update(usersTable).set({ sessionId: "" }).where(eq(usersTable.sessionId, sessionId));
}
