import { generateRandomString } from "@oslojs/crypto/random";
import type { RandomReader } from "@oslojs/crypto/random";
import { VERIFICATION_CODE_ALPHABET } from "@/configs/constants";

export function generateVerificationCode() {
    const random: RandomReader = {
        read(bytes) {
            crypto.getRandomValues(bytes);
        },
    };

    return generateRandomString(random, VERIFICATION_CODE_ALPHABET, 6);
}