"use client";

import useSession from "@/hooks/use-session";
import SignUp from "@/components/SignUp/SignUp";
import SignIn from "@/components/SignIn/SignIn";
import Logout from "@/components/Logout/Logout";

export function Form({ type }: { type: "sign-in" | "sign-up" }) {
    const { session, isLoading } = useSession();

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (session.isLoggedIn) {
        return (
            <div className="max-w-xl flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <p>
                        Никнейм текущей сессии: <strong className="text-[#dc8a78]">{session.username}</strong>
                    </p>
                    <p>
                        Почта текущей сессии: <strong className="text-[#dc8a78]">{session.email}</strong>
                    </p>
                </div>
                <Logout/>
            </div>
        );
    }

    switch (type) {
        case "sign-in":
            return <SignIn/>;
        case "sign-up":
        default:
            return <SignUp/>;
    }
}