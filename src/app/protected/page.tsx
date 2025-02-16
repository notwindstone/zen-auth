"use client";

import useSession from "@/hooks/use-session";
import { useEffect } from "react";
import { useRouter } from "nextjs-toploader/app";
import Link from "next/link";

export default function ProtectedClient() {
    return (
        <main className="p-10 space-y-5">
            <Content />
            <p>
                <Link
                    href="/"
                >
                    ← Back
                </Link>
            </p>
        </main>
    );
}

function Content() {
    const { session, isLoading } = useSession();

    if (isLoading) {
        return <p className="text-lg">Loading...</p>;
    }

    if (!session.isLoggedIn) {
        return (
            <p className="text-lg">
                Please sign in.
            </p>
        );
    }

    return (
        <div className="max-w-xl space-y-2">
            <p>
                Hello <strong>{session.username}!</strong>
            </p>
            <p>
                This page is protected and can only be accessed if you are logged in.
                Otherwise you will be redirected to the login page.
            </p>
            <p>The check is done via a fetch call on the client using SWR.</p>
            <p>
                One benefit of using{" "}
                <a href="https://swr.vercel.app" target="_blank">
                    SWR
                </a>
                : if you open the page in different tabs/windows, and logout from one
                place, every other tab/window will be synced and logged out.
            </p>
        </div>
    );
}