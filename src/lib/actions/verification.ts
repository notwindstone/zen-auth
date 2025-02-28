import { db } from "@/db/db";
import { verificationCodesTable } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";

export function generateVerificationCode(): string {
    const randomSixDigitNumber = Math.floor(
        Math.pow(10, 5) + (Math.random() * 9 * Math.pow(10, 5)),
    );

    return randomSixDigitNumber.toString();
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