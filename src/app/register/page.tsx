import RegisterForm from "@/components/forms/RegisterForm/RegisterForm";
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

    const cookieStorage = await cookies();
    const token = cookieStorage.get(COOKIES_KEY)?.value as string;

    return (
        <>
            <RegisterForm
                token={token}
                usernamePlaceholder={username as string}
                emailPlaceholder={email as string}
            />
        </>
    );
}