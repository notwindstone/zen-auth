import { config } from "dotenv";
import { generalRateLimit as localGeneralRateLimit } from "@/lib/ratelimit/ioredis";
import { generalRateLimit as upstashGeneralRateLimit } from "@/lib/ratelimit/upstash";

config({ path: ".env.local" });

export async function RateLimit({
    token,
}: {
    token: string;
}) {
    switch (process.env.REDIS_TYPE!.toLowerCase()) {
        case "local":
            return await localGeneralRateLimit({
                ip: token,
                limit: 5,
                duration: 4,
            });
        case "upstash":
            return await upstashGeneralRateLimit.limit(token);
        default:
            return new Error();
    }
}