import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { config } from "dotenv";

config({ path: ".env.local" });

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL! ?? "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN! ?? "",
});

// Max tokens: set to 15, allowing a burst of up to 15 requests
// Refill rate: set to 10 tokens per 4 seconds
export const generalRateLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.tokenBucket(10, "4 s", 15),
});

export const verificationRateLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(2, "120 s"),
});

export const resetTokenRateLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(2, "120 s"),
});