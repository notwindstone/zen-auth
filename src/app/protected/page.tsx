"use client";

import useSession from "@/hooks/use-session";
import Link from "next/link";

export default function ProtectedClient() {
    return (
        <main className="p-10 space-y-5">
            <Content />
            <p>
                <Link
                    className="bg-black hover:bg-zinc-800 focus:bg-zinc-700 text-white rounded-md py-2 px-4 transition"
                    href="/"
                >
                    Назад
                </Link>
            </p>
        </main>
    );
}

function Content() {
    const { session, isLoading } = useSession();

    if (isLoading) {
        return <p className="text-lg">Loading...</p>;
    }

    if (!session.isLoggedIn) {
        return (
            <p className="text-lg">
                Вам нужно войти в аккаунт, чтобы увидеть данную страницу.
            </p>
        );
    }

    return (
        <div className="text-lg max-w-xl space-y-2">
            <p>
                Никнейм текущей сессии: <strong className="text-[#dc8a78]">{session.username}</strong>
            </p>
            <p>
                Почта текущей сессии: <strong className="text-[#dc8a78]">{session.email}</strong>
            </p>
            <p>
                Данная страница защищена от любопытных глаз анонимных пользователей и требует обязательного входа в аккаунт.
            </p>
            <p>
                Проверка осуществляется с помощью сравнения идентификатора сессии, сохранённого в браузере, и идентификатора сессии, сохранённого в базе данных сервера.
            </p>
            <p>
                Если открыть эту страницу в новой вкладке или новом окне, а затем выйти из аккаунта, то другие вкладки тоже синхронизируются.
            </p>
        </div>
    );
}