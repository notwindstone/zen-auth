"use server";

import {getUserEmail} from "@/queries/select";

export default async function checkUser(email: string) {
    const currentUser = (await getUserEmail(email))?.[0];

    return {
        username: currentUser?.name,
        email: currentUser?.email,
        exists: currentUser?.email === email,
    };
}