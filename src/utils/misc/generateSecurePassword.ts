export function generateSecurePassword({
    password,
}: {
    password: string;
}): {
    hashed: string;
    salt: string;
} {
    let hashed: string;
    let salt: string;

    const saltRounds = 10;


    return {
        hashed,
        salt,
    };
}