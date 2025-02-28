import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { config } from "dotenv";

config({ path: ".env.local" });

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Max tokens: set to 5, allowing a burst of up to 5 requests
// Refill rate: set to 1.25 per second (refills 5 tokens every 4 seconds)
export const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.tokenBucket(5, "4 s", 5),
});