import { Argon2id } from "oslo/password";

export async function generateSecurePassword({
    password,
}: {
    password: string;
}): Promise<{
    hash: string;
}> {
    const argon2id = new Argon2id();
    const hash = await argon2id.hash(password);

    return {
        hash,
    };
}