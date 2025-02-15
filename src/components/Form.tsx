"use client";

import useSession from "@/hooks/use-session";
import { defaultSession } from "@/lib/sessions";
import SignUp from "@/components/SignUp/SignUp";
import SignIn from "@/components/SignIn/SignIn";
import {useEffect} from "react";

export function Form({ type }: { type: "sign-in" | "sign-up" }) {
    const { session, isLoading } = useSession();

    if (isLoading) {
        return <p className="text-lg">Loading...</p>;
    }

    if (session.isLoggedIn) {
        return (
            <>
                <p className="text-lg">
                    Logged in user: <strong>{session.username}</strong>
                </p>
                <LogoutButton />
            </>
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



function LogoutButton() {
    const {logout} = useSession();

    return (
        <p>
            <a
                onClick={(event) => {
                    event.preventDefault();
                    logout(null, {
                        optimisticData: defaultSession,
                    });
                }}
            >
                Logout
            </a>
        </p>
    );
}