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