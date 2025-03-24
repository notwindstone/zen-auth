export default function Page() {
    return (
        <div className="flex flex-col gap-2">
            <div className="text-sm text-zinc-400">
                Произошла ошибка при авторизации через OAuth2, связанная с отсутствием токена сессии в cookies.
            </div>
            <div className="text-sm text-zinc-400">
                Возможно, вы начали процесс входа в одном браузере (например, через встроенный в телеграм), а закончили в другом (например, открыли страницу OAuth2 провайдера в Firefox или Chrome).
            </div>
            <div className="text-lg">
                Вам нужно использовать для авторизации только {<strong>один</strong>} браузер.
            </div>
        </div>
    );
}