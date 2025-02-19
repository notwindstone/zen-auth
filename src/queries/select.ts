"use server";

import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import {SelectUser, SelectVerificationCode, usersTable, verificationCodesTable} from '@/db/schema';
import bcrypt from "bcrypt";

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

export async function checkHashedPassword({
    email,
    password,
}: {
    email: SelectUser['email'],
    password: SelectUser['password'],
}): Promise<boolean> {
    const response = db.select({
        hashedPassword: usersTable.password,
    }).from(usersTable).where(eq(usersTable.email, email));
    const serverPassword = (await response)?.[0].hashedPassword;

    return await bcrypt.compare(password, serverPassword);
}

export async function checkVerificationCodes({
    email,
    code
}: {
    email: SelectVerificationCode['email'],
    code: SelectVerificationCode['code'],
}): Promise<boolean> {
    const response = db.select({
        code: verificationCodesTable.code,
        expiresAt: verificationCodesTable.expiresAt,
        isUsed: verificationCodesTable.isUsed,
    }).from(verificationCodesTable).where(
        eq(verificationCodesTable.email, email),
    );
    const foundCode = (await response)?.filter((elem) => {
        const notExpired = elem.expiresAt.getTime() > (new Date()).getTime();

        return !elem.isUsed && (elem.code === code) && notExpired;
    });

    return Boolean(foundCode?.[0]);
}