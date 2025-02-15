import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { SelectUser, usersTable } from '@/db/schema';
import {use} from "react";

export async function getUserEmail(email: SelectUser['email']): Promise<
    Array<{
        email: string;
    }>
> {
    return db.select({
        email: usersTable.email,
    }).from(usersTable).where(eq(usersTable.email, email));
}

export async function getSessionId(email: SelectUser['email']): Promise<
    Array<{
        sessionId: string;
    }>
> {
    return db.select({
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