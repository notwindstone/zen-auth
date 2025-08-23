import { getSession } from "@/lib/routes/session/getSession";
import { cookies } from "next/headers";
import { COOKIES_KEY } from "@/configs/constants";
import { DashboardLRUCacheRateLimit } from "@/lib/ratelimit/lrucache";

export default async function Page() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIES_KEY)?.value ?? null;
    const dashboardRateLimited = DashboardLRUCacheRateLimit(token ?? "");

    if (dashboardRateLimited) {
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

    const data = await response.json();
    const user = data.user;
    
    if (user.username !== 'notwindstone') {
        return (
            <div>
                you are logged in, but you are not admin.
            </div>
        );
    }

    return (
        <div>
            you made it!
        </div>
    );
}