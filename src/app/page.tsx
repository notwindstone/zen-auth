import Link from "next/link";
import RegisterForm from "@/components/forms/RegisterForm/RegisterForm";
import { PAGE_ROUTES } from "@/configs/pages";
import { cookies } from "next/headers";
import { COOKIES_KEY } from "@/configs/constants";

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | null }>;
}) {
    const searchParamsStore = await searchParams;
    const oauthRTL = Boolean(searchParamsStore?.oauthRTL);

    const cookieStorage = await cookies();
    const token = cookieStorage.get(COOKIES_KEY)?.value as string;

    return (
        <main className="p-10">
            <div className="mx-auto p-4 rounded-md flex flex-col gap-4 w-full max-w-fit bg-zinc-800 border-[1px] border-zinc-500">
                <div className="mb-4">
                    <p className="text-2xl font-bold">
                        Главная
                    </p>
                    <a
                        target="_blank"
                        className="text-zinc-400 transition hover:text-white"
                        href="https://github.com/notwindstone/authless-next-demo"
                    >
                        Github репозиторий
                    </a>
                </div>
                <RegisterForm
                    token={token}
                    usernamePlaceholder={""}
                    emailPlaceholder={""}
                    oauthRTL={oauthRTL}
                />
                <Link
                    className="w-full max-w-[464px] text-center hover:bg-zinc-200 bg-white focus:bg-zinc-300 text-black rounded-md py-2 px-4 transition"
                    href={PAGE_ROUTES.PROFILE.ROOT}
                >
                    Перейти в профиль
                </Link>
            </div>
        </main>
    );
}
