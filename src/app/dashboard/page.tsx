"use server";

import { getSession } from "@/lib/routes/session/getSession";
import { cookies } from "next/headers";

export default async function Page() {
    const cookie = await cookies();
    const token = cookie.get('zen_auth_session') ?? null;
    const response = await getSession({
        token,
    });

    console.log(session, user);

    return (
        <div>

        </div>
    );
}