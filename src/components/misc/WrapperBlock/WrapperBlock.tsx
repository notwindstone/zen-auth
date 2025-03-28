"use client";

import Link from "next/link";
import { PAGE_ROUTES } from "@/configs/pages";
import { usePathname } from "next/navigation";

export default function WrapperBlock({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    let translatedPathname;

    switch (pathname) {
        case PAGE_ROUTES.HOME:
            translatedPathname = "Главная";

            break;
        case PAGE_ROUTES.REGISTER:
            translatedPathname = "Регистрация";

            break;
        case PAGE_ROUTES.LOGIN:
            translatedPathname = "Вход";

            break;
        default:
            translatedPathname = pathname;
    }

    return (
        <div className="p-1 sm:p-10">
            <div
                className="sm:mx-auto sm:max-w-fit sm:rounded-md p-4 flex flex-col gap-4 w-full bg-zinc-900 border-[1px] border-zinc-500 items-center">
                <div className="mb-4 w-full">
                    <p className="text-2xl font-bold">
                        {translatedPathname}
                    </p>
                    <a
                        target="_blank"
                        className="text-zinc-400 transition hover:text-white"
                        href="https://github.com/notwindstone/authless-next-demo"
                    >
                        Github репозиторий
                    </a>
                </div>
                {children}
                <Link
                    className="w-full max-w-[464px] text-center hover:bg-zinc-200 bg-white focus:bg-zinc-300 text-black rounded-md py-2 px-4 transition"
                    href={PAGE_ROUTES.PROFILE.ROOT}
                >
                    Перейти в профиль
                </Link>
            </div>
        </div>
    );
}