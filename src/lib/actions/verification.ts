"use server";

import { db } from "@/db/db";
import {InsertVerificationCode, SelectVerificationCode, verificationCodesTable} from "@/db/schema";
import { v4 as generateUUID } from 'uuid';
import { and, eq, gt } from "drizzle-orm";
import {getMonthForwardDate} from "@/utils/misc/getMonthForwardDate";

export async function createVerificationCode({
    email,
    code,
}: {
    email: InsertVerificationCode['email'],
    code: InsertVerificationCode['code'],
}): Promise<SelectVerificationCode> {
    const verificationCode: InsertVerificationCode = {
        id: generateUUID(),
        code: code,
        expiresAt: getMonthForwardDate(),
        email: email,
        used: false,
    };

    await db.insert(verificationCodesTable).values(verificationCode);

    return verificationCode;
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