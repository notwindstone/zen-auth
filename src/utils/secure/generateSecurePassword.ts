"use server";

import { Argon2id } from "oslo/password";

export async function generateSecurePassword({
    password,
}: {
    password: string;
}): Promise<{
    hash: string;
} | Error> {
    let hash;

    const argon2id = new Argon2id();

    try {
        // It already uses the salting
        hash = await argon2id.hash(password);
    } catch (error) {
        console.error(error);

        return new Error('Internal server error.');
    }

    return {
        hash,
    };
}