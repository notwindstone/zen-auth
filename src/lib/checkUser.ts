"use server";

import {getUserEmail} from "@/queries/select";

export default async function checkUser(email: string) {
    return (await getUserEmail(email))?.[0]?.email === email;
}