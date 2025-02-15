"use client";

import nextJsLogo from '../../public/nextjs-icon.svg'
import useSession from "@/hooks/use-session";
import { defaultSession } from "@/lib/sessions";
import Image from "next/image";
import Link from "next/link";
import {REGISTRATION_INPUTS} from "@/app/configs/constants";
import Login from "@/components/Login/Login";

export function Form() {
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

    return <Login />;
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