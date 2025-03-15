import { Redis } from 'ioredis';
import { config } from "dotenv";

config({ path: ".env.local" });

const redis = new Redis({
    port: Number(process.env.LOCAL_REDIS_PORT!),
    host: process.env.LOCAL_REDIS_URL!,
    username: process.env.LOCAL_REDIS_USERNAME!,
    password: process.env.LOCAL_REDIS_PASSWORD!,
});

export async function ratelimit() {
    redis.set('mykey', 'value');
    redis.get("mykey", (err, result) => {
        if (err) {
            console.error(err);
        } else {
            console.log(result); // Prints "value"
        }
    });
}