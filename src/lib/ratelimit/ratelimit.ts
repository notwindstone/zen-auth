import { config } from "dotenv";
import { decrementRateLimit, rateLimit as localRateLimit } from "@/lib/ratelimit/ioredis";
import {
    generalRateLimit as upstashGeneralRateLimit,
    verificationRateLimit as upstashVerificationRateLimit,
    resetTokenRateLimit as upstashResetTokenRateLimit,
} from "@/lib/ratelimit/upstash";

config({ path: ".env.local" });

// TODO refactor this shit
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
            const expirationTime = await upstashGeneralRateLimit.getRemaining(token);
            const rateLimitResponse = await upstashGeneralRateLimit.limit(token);

            return {
                ...rateLimitResponse,
                expirationTime: expirationTime.reset,
            };
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
            const expirationTime = await upstashVerificationRateLimit.getRemaining(token);
            const rateLimitResponse = await upstashVerificationRateLimit.limit(token);

            return {
                ...rateLimitResponse,
                expirationTime: expirationTime.reset,
            };
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
            const expirationTime = await upstashResetTokenRateLimit.getRemaining(token);
            const rateLimitResponse = await upstashResetTokenRateLimit.limit(token);

            return {
                ...rateLimitResponse,
                expirationTime: expirationTime.reset,
            };
        default:
            return new Error();
    }
}

export async function DecrementVerificationRateLimit({
    token,
}: {
    token: string;
}) {
    switch (process.env.REDIS_TYPE!.toLowerCase()) {
        case "local":
            return await decrementRateLimit({
                token: token,
                rtlKey: "verification",
            });
        case "upstash":
            return await upstashVerificationRateLimit.resetUsedTokens(token);
        default:
            return new Error();
    }
}

export async function DecrementResetRateLimit({
    token,
}: {
    token: string;
}) {
    switch (process.env.REDIS_TYPE!.toLowerCase()) {
        case "local":
            return await decrementRateLimit({
                token: token,
                rtlKey: "reset",
            });
        case "upstash":
            return await upstashVerificationRateLimit.resetUsedTokens(token);
        default:
            return new Error();
    }
}