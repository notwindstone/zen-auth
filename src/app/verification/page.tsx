import CodeVerification from "@/components/forms/CodeVerification/CodeVerification";
import { cookies } from "next/headers";
import { COOKIES_KEY } from "@/configs/constants";

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | null }>;
}) {
    const searchParamsStore = await searchParams;
    const username = searchParamsStore?.username ?? null;
    const email = searchParamsStore?.email ?? null;
    const id = searchParamsStore?.id ?? null;

    const cookieStorage = await cookies();
    const token = cookieStorage.get(COOKIES_KEY)?.value as string;


    return (
        <>
            <CodeVerification
                username={username}
                email={email}
                emailLetterId={id}
                token={token}
            />
        </>
    );
}