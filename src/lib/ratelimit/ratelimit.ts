import { config } from "dotenv";
import { rateLimit as localRateLimit } from "@/lib/ratelimit/ioredis";
import {
    generalRateLimit as upstashGeneralRateLimit,
    verificationRateLimit as upstashVerificationRateLimit,
    resetTokenRateLimit as upstashResetTokenRateLimit,
} from "@/lib/ratelimit/upstash";

config({ path: ".env.local" });

export async function RateLimit({
    token,
}: {
    token: string;
}) {
    switch (process.env.REDIS_TYPE!.toLowerCase()) {
        case "local":
            return await localRateLimit({
                token: token,
                limit: 10,
                duration: 4,
                rtlKey: "general",
            });
        case "upstash":
            return await upstashGeneralRateLimit.limit(token);
        default:
            return new Error();
    }
}

export async function VerificationRateLimit({
    token,
}: {
    token: string;
}) {
    switch (process.env.REDIS_TYPE!.toLowerCase()) {
        case "local":
            return await localRateLimit({
                token: token,
                limit: 1,
                duration: 120,
                rtlKey: "verification",
            });
        case "upstash":
            return await upstashVerificationRateLimit.limit(token);
        default:
            return new Error();
    }
}

export async function ResetRateLimit({
    token,
}: {
    token: string;
}) {
    switch (process.env.REDIS_TYPE!.toLowerCase()) {
        case "local":
            return await localRateLimit({
                token: token,
                limit: 1,
                duration: 120,
                rtlKey: "reset",
            });
        case "upstash":
            return await upstashResetTokenRateLimit.limit(token);
        default:
            return new Error();
    }
}