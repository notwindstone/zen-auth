"use server";

import { db } from "@/db/db";
import { InsertVerificationCode, verificationCodesTable } from "@/db/schema";
import { v4 as generateUUID } from 'uuid';
import { and, eq, gt } from "drizzle-orm";

export async function createVerificationCode({
    email,
    code,
}: {
    email: InsertVerificationCode['email'],
    code: InsertVerificationCode['code'],
}): Promise<any> {
    const verificationCode: InsertVerificationCode = {
        id: generateUUID(),
        code: code,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        email: email,
        used: false,
    };

    await db.insert(verificationCodesTable).values(verificationCode);

    return;
}

export async function getVerificationCodes({
    email,
}: {
    email: string;
}): Promise<Array<{
    code: string;
}>> {
    return db
        .select({
            code: verificationCodesTable.code,
        })
        .from(verificationCodesTable)
        .where(
            and(
                eq(verificationCodesTable.email, email),
                eq(verificationCodesTable.used, false),
                gt(verificationCodesTable.expiresAt, new Date()),
            ),
        );
}