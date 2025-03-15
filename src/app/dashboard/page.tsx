import { getSession } from "@/lib/routes/session/getSession";
import { cookies } from "next/headers";
import { COOKIES_KEY } from "@/configs/constants";
import { generalRateLimit } from "@/lib/ratelimit/upstash";
import {ratelimit} from "@/lib/ratelimit/ioredis";

export default async function Page() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIES_KEY)?.value ?? null;

    const rateLimitResult = await generalRateLimit.limit(token as string);

    if (!rateLimitResult.success) {
        return (
            <div>
                STOP SPAMMING REQUESTS
            </div>
        );
    }

    const response = await getSession({
        token,
    });

    if (!response.ok) {
        return (
            <div>
                nah mate, you are not passing. This is a server component. Your status code: {response.status}
            </div>
        );
    }
    ratelimit()
    return (
        <div>
            you made it!
        </div>
    );
}