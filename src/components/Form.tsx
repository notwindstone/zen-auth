"use client";

import useSession from "@/hooks/use-session";
import SignUp from "@/components/SignUp/SignUp";
import SignIn from "@/components/SignIn/SignIn";
import Logout from "@/components/Logout/Logout";

export function Form({ type }: { type: "sign-in" | "sign-up" }) {
    const { session, isLoading } = useSession();

    if (isLoading) {
        return <p className="text-lg">Loading...</p>;
    }

    if (session.isLoggedIn) {
        return (
            <div>
                <p className="text-lg">
                    Logged in user: <strong>{session.username}</strong>
                </p>
                <p>
                    Email: <strong>{session.email}</strong>
                </p>
                <Logout />
            </div>
        );
    }

    switch (type) {
        case "sign-in":
            return <SignIn />;
        case "sign-up":
        default:
            return <SignUp />;
    }
}