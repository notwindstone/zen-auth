"use server";

import { db } from "@/db/db";
import { verificationCodesTable } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";

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