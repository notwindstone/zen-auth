import LoginForm from "@/components/LoginForm/LoginForm";
import {cookies} from "next/headers";
import {COOKIES_KEY} from "@/configs/constants";

export default async function Page() {
    const cookieStorage = await cookies();
    const token = cookieStorage.get(COOKIES_KEY)?.value as string;

    return (
        <>
            <LoginForm token={token} />
        </>
    );
}