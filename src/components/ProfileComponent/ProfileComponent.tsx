"use client";

import useSession from "@/hooks/use-session";

export default function ProfileComponent() {
    const { session, isLoading } = useSession();

    if (isLoading) {
        return (
            <p>
                Загрузка...
            </p>
        );
    }

    return (
        <div className="max-w-xl flex flex-col gap-2">
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