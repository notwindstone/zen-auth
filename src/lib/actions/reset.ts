"use server";

import { TableResetCodeType, resetCodesTable } from "@/db/schema";
import { v4 as generateUUID } from "uuid";
import { getHourForwardDate } from "@/utils/misc/getHourForwardDate";
import { db } from "@/db/db";
import { and, eq, gt } from "drizzle-orm";
import {PLACEHOLDER_STRING} from "@/configs/constants";

export async function createResetToken({
    email,
    resetToken,
}: {
    email: TableResetCodeType['email'],
    resetToken: TableResetCodeType['resetToken'],
}): Promise<TableResetCodeType | Error> {
    const verificationCode: TableResetCodeType = {
        id: generateUUID(),
        resetToken: resetToken,
        expiresAt: getHourForwardDate(),
        email: email,
    };

    try {
        await db
            .insert(resetCodesTable)
            .values(verificationCode)
            .onConflictDoUpdate({
                target: resetCodesTable.email,
                set: {
                    id: verificationCode.id,
                    resetToken: verificationCode.resetToken,
                    expiresAt: verificationCode.expiresAt,
                },
            });
    } catch {
        return new Error("Internal server error.");
    }

    return verificationCode;
}

export async function removeResetToken({
    email,
    resetToken,
}: {
    email: TableResetCodeType['email'],
    resetToken: TableResetCodeType['resetToken'],
}): Promise<string | Error> {
    try {
        await db
            .delete(resetCodesTable)
            .where(
                and(
                    eq(resetCodesTable.email, email),
                    eq(resetCodesTable.resetToken, resetToken),
                ),
            );
    } catch {
        return new Error("Internal server error.");
    }

    return PLACEHOLDER_STRING;
}

export async function getResetToken({
    email,
}: {
    email: string;
}): Promise<Array<{
    resetToken: TableResetCodeType['resetToken'];
}> | Error> {
    let result;

    try {
        result = await db
            .select({
                resetToken: resetCodesTable.resetToken,
            })
            .from(resetCodesTable)
            .where(
                and(
                    eq(resetCodesTable.email, email),
                    gt(resetCodesTable.expiresAt, new Date()),
                ),
            );
    } catch {
        return new Error("Internal server error.");
    }

    return result;
}