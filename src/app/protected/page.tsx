import Link from "next/link";
import ProfileComponent from "@/components/ProfileComponent/ProfileComponent";
import {cookies} from "next/headers";
import {getSessionId} from "@/queries/select";
import {SessionData, sessionOptions} from "@/lib/sessions";
import {getIronSession} from "iron-session";

export default async function ProtectedClient() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.isLoggedIn) {
        return (
            <div className="p-10 flex flex-col gap-4">
                <p>
                    Вам нужно войти в аккаунт, чтобы увидеть данную страницу.
                </p>
                <Link
                    className="flex-1 text-center hover:bg-zinc-700 bg-zinc-800 focus:bg-zinc-600 text-white rounded-md py-2 px-4 transition"
                    href="/"
                >
                    Главная
                </Link>
            </div>
        );
    }

    const sessionId = (await cookies()).get("authless-next-cookies-key-name")?.value ?? "";
    const fetchedData = (await getSessionId(session.email))?.[0];
    const foundSessionId = fetchedData?.sessionId;

    if (foundSessionId !== sessionId) {
        return (
            <div className="p-10 flex flex-col gap-4">
                <p>
                    Сессии не совпадают. Пожалуйста, перезайдите в аккаунт.
                </p>
                <Link
                    className="flex-1 text-center hover:bg-zinc-700 bg-zinc-800 focus:bg-zinc-600 text-white rounded-md py-2 px-4 transition"
                    href="/"
                >
                    Главная
                </Link>
            </div>
        );
    }

    return (
        <main className="p-10 flex flex-col gap-4">
            <ProfileComponent/>
            <p>
                <Link
                    className="hover:bg-zinc-700 bg-zinc-800 focus:bg-zinc-600 text-white rounded-md py-2 px-4 transition"
                    href="/"
                >
                    Назад
                </Link>
            </p>
        </main>
    );
}

