import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { SelectUser, usersTable } from '@/db/schema';

export async function getUser(email: SelectUser['email']): Promise<
    Array<{
        uuid: string;
        name: string;
        email: string;
        sessionId: string;
    }>
> {
    return db.select().from(usersTable).where(eq(usersTable.email, email));
}