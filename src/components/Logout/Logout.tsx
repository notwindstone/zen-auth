import useSession from "@/hooks/use-session";
import {defaultSession} from "@/lib/sessions";

export default function Logout() {
    const { logout } = useSession();

    return (
        <button
            className="hover:bg-zinc-700 bg-zinc-800 focus:bg-zinc-600 text-white rounded-md py-2 px-4 transition"
            onClick={(event) => {
                event.preventDefault();

                logout(null, {
                    optimisticData: defaultSession,
                });
            }}
        >
            Выйти
        </button>
    );
}