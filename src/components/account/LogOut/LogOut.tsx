import { deleteSessionTokenCookie } from "@/lib/actions/cookies";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";

export default function LogOut() {
    const queryClient = useQueryClient();
    const router = useRouter();

    async function removeSession() {
        const response = await fetch('/api/session/current', {
            method: "DELETE",
        });

        if (!response.ok) {
            alert("something went wrong");

            return;
        }

        deleteSessionTokenCookie().then(() => {
            queryClient.clear();
            router.push('/');
        });
    }

    return (
        <>
            <button
                onClick={removeSession}
            >
                Выйти
            </button>
        </>
    );
}