"use client";

import Link from "next/link";

export default function Page() {
    return (
        <div className="flex flex-col gap-4">
            <p>
                This page is temporary client-sided.
            </p>
            <div className="flex flex-col gap-2">
                <p>
                    Currently available buttons {
                        <span className="text-zinc-400">(session token это не session id)</span>
                    }:
                </p>
                <button
                    className="w-fit bg-latte-rosewater text-black rounded px-2 py-1 transition hover:bg-orange-200"
                >
                    Add session token to cookies
                </button>
                <button
                    className="w-fit bg-latte-rosewater text-black rounded px-2 py-1 transition hover:bg-orange-200"
                >
                    Remove session token from cookies
                </button>
            </div>
            <div className="flex flex-col">
                <p>
                    Currently available pages:
                </p>
                <Link className="text-zinc-400" href={"/dashboard"}>
                    dashboard
                </Link>
                <Link className="text-zinc-400" href={"/profile"}>
                    profile
                </Link>
                <Link className="text-zinc-400" href={"/profile/notwindstone"}>
                    notwindstone
                </Link>
                <Link className="text-zinc-400" href={"/profile/not_existing_user"}>
                    not_existing_user
                </Link>
            </div>
            <div className="flex flex-col">
                <p>
                    Currently available api routes:
                </p>
                <Link className="text-zinc-400" href={"/api/profile"}>
                    /api/profile
                </Link>
                <Link className="text-zinc-400" href={"/api/profile?username=notwindstone"}>
                    /api/profile?username=notwindstone
                </Link>
                <Link className="text-zinc-400" href={"/api/profile?username=not_existing_user"}>
                    /api/profile?username=not_existing_user
                </Link>
                <Link className="text-zinc-400" href={"/api/session/current"}>
                    /api/session/current
                </Link>
                <Link className="text-zinc-400" href={"/api/session/all"}>
                    /api/session/all
                </Link>
            </div>
        </div>
    );
}
