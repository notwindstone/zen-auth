import { getSession } from "@/lib/routes/session/getSession";
import { cookies } from "next/headers";
import { COOKIES_KEY } from "@/configs/constants";

export default async function Page() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIES_KEY)?.value ?? null;
    const response = await getSession({
        token,
    });

    if (!response.ok) {
        return (
            <div>
                nah mate, you are not passing {response.status}
            </div>
        );
    }

    return (
        <div>
            1234
        </div>
    );
}