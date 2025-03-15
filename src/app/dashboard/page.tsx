import { getSession } from "@/lib/routes/session/getSession";
import { cookies } from "next/headers";
import { COOKIES_KEY } from "@/configs/constants";
import { RateLimit } from "@/lib/ratelimit/ratelimit";
import { types } from "node:util";

export default async function Page() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIES_KEY)?.value ?? null;
    const rateLimit = await RateLimit({
        token: token as string,
    });

    if (types.isNativeError(rateLimit)) {
        return (
            <div>
                Please, select redis instance in the .env.local
            </div>
        );
    }

    if (!rateLimit.success) {
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

    return (
        <div>
            you made it!
        </div>
    );
}