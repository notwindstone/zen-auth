"use server";

import { Redis } from 'ioredis';
import { config } from "dotenv";

config({ path: ".env.local" });

let redis: Redis | undefined;

if (process.env.REDIS_TYPE!.toLowerCase() === "local") {
    redis = new Redis({
        port: Number(process.env.LOCAL_REDIS_PORT! ?? '0'),
        host: process.env.LOCAL_REDIS_URL! ?? "",
        username: process.env.LOCAL_REDIS_USERNAME! ?? "",
        password: process.env.LOCAL_REDIS_PASSWORD! ?? "",
    });
}

export async function rateLimit({
    token,
    limit,
    duration,
    rtlKey,
}: {
    token: string;
    limit: number;
    duration: number;
    rtlKey: string;
}): Promise<{
    limit: number;
    remaining: number;
    success: boolean;
    expirationTime: number | undefined;
}> {
    const key = `rate_limit_${rtlKey}:${token}`;
    const currentCount = await redis?.get(key);
    const count = parseInt(currentCount as string, 10) || 0;
    const expirationTime = await redis?.expiretime(key);

    if (count >= limit) {
        return {
            limit,
            remaining: limit - count,
            success: false,
            expirationTime: expirationTime,
        };
    }

    redis?.incr(key);
    redis?.expire(key, duration);

    return {
        limit,
        remaining: limit - (count + 1),
        success: true,
        expirationTime: expirationTime,
    };
}

export async function decrementRateLimit({
    token,
    rtlKey,
}: {
    token: string;
    rtlKey: string;
}): Promise<{
    success: boolean;
}> {
    const key = `rate_limit_${rtlKey}:${token}`;

    redis?.decr(key);

    return {
        success: true,
    };
}