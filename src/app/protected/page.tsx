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
            <p className="p-10">
                Вам нужно войти в аккаунт, чтобы увидеть данную страницу.
            </p>
        );
    }

    const sessionId = (await cookies()).get("authless-next-cookies-key-name")?.value ?? "";
    const fetchedData = (await getSessionId(session.email))?.[0];
    const foundSessionId = fetchedData?.sessionId;

    if (foundSessionId !== sessionId) {
        return (
            <p className="p-10">
                Сессии не совпадают. Пожалуйста, перезайдите в аккаунт.
            </p>
        );
    }

    return (
        <main className="p-10 flex flex-col gap-4">
            <ProfileComponent />
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

