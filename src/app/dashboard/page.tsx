import { getSession } from "@/lib/routes/session/getSession";
import { cookies } from "next/headers";

export default async function Page() {
    const cookieStore = await cookies();
    const token = cookieStore.get('zen_auth_session')?.value ?? null;
    const response = await getSession({
        token,
    });

    if (!response.ok) {
        return (
            <div>
                nah mate, your not passing
            </div>
        );
    }

    return (
        <div>
        </div>
    );
}