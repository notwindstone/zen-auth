import RegisterForm from "@/components/forms/RegisterForm/RegisterForm";
import { cookies } from "next/headers";
import { COOKIES_KEY } from "@/configs/constants";
import { OAUTH2_ERROR_BASE_PARAMS } from "@/configs/api";

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | null }>;
}) {
    const searchParamsStore = await searchParams;
    const username = searchParamsStore?.username ?? null;
    const email = searchParamsStore?.email ?? null;
    const oauthError = searchParamsStore?.[OAUTH2_ERROR_BASE_PARAMS] as string;

    const cookieStorage = await cookies();
    const token = cookieStorage.get(COOKIES_KEY)?.value as string;

    return (
        <>
            <RegisterForm
                token={token}
                usernamePlaceholder={username as string}
                emailPlaceholder={email as string}
                oauthError={oauthError}
            />
        </>
    );
}