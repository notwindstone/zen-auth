"use server";

import { db } from "@/db/db";
import { TableVerificationCodeType, verificationCodesTable } from "@/db/schema";
import { v4 as generateUUID } from 'uuid';
import { and, eq, gt } from "drizzle-orm";
import { getHourForwardDate } from "@/utils/misc/getHourForwardDate";
import { PLACEHOLDER_STRING } from "@/configs/constants";

export async function createVerificationCode({
    email,
    code,
}: {
    email: TableVerificationCodeType['email'],
    code: TableVerificationCodeType['code'],
}): Promise<TableVerificationCodeType | Error> {
    const verificationCode: TableVerificationCodeType = {
        id: generateUUID(),
        code: code,
        expiresAt: getHourForwardDate(),
        email: email,
    };

    try {
        await db
            .insert(verificationCodesTable)
            .values(verificationCode)
            .onConflictDoUpdate({
                target: verificationCodesTable.email,
                set: {
                    id: verificationCode.id,
                    code: verificationCode.code,
                    expiresAt: verificationCode.expiresAt,
                },
            });
    } catch {
        return new Error("Internal server error.");
    }

    return verificationCode;
}

export async function removeVerificationCode({
    email,
    code,
}: {
    email: TableVerificationCodeType['email'],
    code: TableVerificationCodeType['code'],
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

    return PLACEHOLDER_STRING;
}

export async function getVerificationCodes({
    email,
}: {
    email: string;
}): Promise<Array<{
    code: string;
}> | Error> {
    let result;

    try {
        result = await db
            .select({
                code: verificationCodesTable.code,
            })
            .from(verificationCodesTable)
            .where(
                and(
                    eq(verificationCodesTable.email, email),
                    gt(verificationCodesTable.expiresAt, new Date()),
                ),
            );
    } catch {
        return new Error("Internal server error.");
    }

    return result;
}