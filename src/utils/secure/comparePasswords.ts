"use server";

import { Argon2id } from "oslo/password";

export async function comparePasswords({
    password,
    hashedPassword,
}: {
    password: string;
    hashedPassword: string;
}): Promise<boolean> {
    const argon2id = new Argon2id();

    return await argon2id.verify(hashedPassword, password);
}