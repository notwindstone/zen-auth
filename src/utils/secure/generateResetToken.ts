import { generateRandomString } from "@oslojs/crypto/random";
import type { RandomReader } from "@oslojs/crypto/random";
import { RESET_TOKEN_ALPHABET } from "@/configs/constants";

export function generateResetToken() {
    const random: RandomReader = {
        read(bytes) {
            crypto.getRandomValues(bytes);
        },
    };

    return generateRandomString(random, RESET_TOKEN_ALPHABET, 64);
}