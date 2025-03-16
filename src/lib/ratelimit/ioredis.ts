"use server";

import { Redis } from 'ioredis';
import { config } from "dotenv";

config({ path: ".env.local" });

const redis = new Redis({
    port: Number(process.env.LOCAL_REDIS_PORT!),
    host: process.env.LOCAL_REDIS_URL!,
    username: process.env.LOCAL_REDIS_USERNAME!,
    password: process.env.LOCAL_REDIS_PASSWORD!,
});

export async function generalRateLimit({
    ip,
    limit,
    duration,
}: {
    ip: string;
    limit: number;
    duration: number;
}): Promise<{
    limit: number;
    remaining: number;
    success: boolean;
}> {
    const key = `rate_limit:${ip}`;
    const currentCount = await redis.get(key);
    const count = parseInt(currentCount as string, 10) || 0;

    if (count >= limit) {
        return {
            limit,
            remaining: limit - count,
            success: false,
        };
    }

    redis.incr(key);
    redis.expire(key, duration);

    return {
        limit,
        remaining: limit - (count + 1),
        success: true,
    };
}