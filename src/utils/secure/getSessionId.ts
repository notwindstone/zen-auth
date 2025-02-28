import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

export default function getSessionId({
    token,
}: {
    token: string;
}) {
    return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}