import LoginForm from "@/components/forms/LoginForm/LoginForm";
import { cookies } from "next/headers";
import { COOKIES_KEY } from "@/configs/constants";
import { OAUTH2_ERROR_BASE_PARAMS } from "@/configs/api";
import WrapperBlock from "@/components/misc/WrapperBlock/WrapperBlock";

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | null }>;
}) {
    const searchParamsStore = await searchParams;
    const oauthError = searchParamsStore?.[OAUTH2_ERROR_BASE_PARAMS] as string;

    const cookieStorage = await cookies();
    const token = cookieStorage.get(COOKIES_KEY)?.value as string;

    return (
        <WrapperBlock>
            <LoginForm token={token} oauthError={oauthError} />
        </WrapperBlock>
    );
}