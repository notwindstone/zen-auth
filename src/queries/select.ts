import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { SelectUser, usersTable } from '@/db/schema';

export async function getUserById(uuid: SelectUser['uuid']): Promise<
    Array<{
        uuid: string;
        name: string;
        email: string;
        sessionId: string;
    }>
> {
    return db.select().from(usersTable).where(eq(usersTable.uuid, uuid));
}