"use server";

import { db } from "@/db/db";
import { InsertVerificationCode, SelectVerificationCode, verificationCodesTable } from "@/db/schema";
import { v4 as generateUUID } from 'uuid';
import { and, eq, gt } from "drizzle-orm";
import { getHourForwardDate } from "@/utils/misc/getHourForwardDate";

export async function createVerificationCode({
    email,
    code,
}: {
    email: InsertVerificationCode['email'],
    code: InsertVerificationCode['code'],
}): Promise<SelectVerificationCode | Error> {
    const verificationCode: InsertVerificationCode = {
        id: generateUUID(),
        code: code,
        expiresAt: getHourForwardDate(),
        email: email,
        used: false,
    };

    try {
        await db.insert(verificationCodesTable).values(verificationCode);
    } catch {
        return new Error("Internal server error.");
    }

    return verificationCode;
}

export async function removeVerificationCode({
    email,
    code,
}: {
    email: InsertVerificationCode['email'],
    code: InsertVerificationCode['code'],
}): Promise<string | Error> {
    try {
        await db
            .delete(verificationCodesTable)
            .where(
                and(
                    eq(verificationCodesTable.email, email),
                    eq(verificationCodesTable.code, code),
                ),
            );
    } catch {
        return new Error("Internal server error.");
    }

    return "Done!";
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