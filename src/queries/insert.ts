"use server";

import { db } from '@/db/db';
import {InsertUser, usersTable, verificationCodesTable} from '@/db/schema';
import { v4 as generateUUID } from 'uuid';
import sendEmail from "@/lib/sendEmail";

export async function createUser(data: InsertUser) {
    await db.insert(usersTable).values(data);
}

export async function createVerificationCode({
    email,
    username,
}: {
    email: string;
    username: string;
}) {
    const uuid = generateUUID();
    const expiresAt = new Date();
    const verificationCode = (Math.floor(100000 + (Math.random() * 900000))).toString();

    expiresAt.setMinutes(expiresAt.getMinutes() + 20);

    await db.insert(verificationCodesTable).values({
        uuid: uuid,
        email: email,
        isUsed: false,
        expiresAt: expiresAt,
        code: verificationCode,
    });

    await sendEmail({
        code: verificationCode,
        email: email,
        username: username,
    });
}