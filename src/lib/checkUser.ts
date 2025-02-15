"use server";

import {getUser} from "@/queries/select";

export default async function checkUser(email: string) {
    return (await getUser(email))?.[0];
}