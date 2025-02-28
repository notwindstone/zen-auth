"use client";

import Link from "next/link";
import { deleteSessionTokenCookie, setSessionTokenCookie } from "@/lib/actions/cookies";
import { getEmailInfo } from "@/lib/actions/email";
import { useRef } from "react";
import { getMonthForwardDate } from "@/utils/misc/getMonthForwardDate";

export default function Page() {
    const emailLetterId = useRef('');
    const isVerified = useRef(false);

    async function verifyEmail() {
        const response = await fetch('/api/verification', {
            method: "PUT",
            body: JSON.stringify({
                email: 'notwindstone@gmail.com',
                code: "883239",
                username: "notwindstone",
                displayName: 'windstone',
                password: 'sheet',
            }),
        });

        if (!response.ok) {
            alert('Response is not ok');

            return;
        }

        isVerified.current = true;
        alert(true);

        return;
    }

    async function checkEmailLetter() {
        const response = await getEmailInfo({
            id: emailLetterId.current,
        });

        alert(response?.data?.last_event);
    }

    async function sendVerificationCode() {
        const response = await fetch('/api/verification', {
            method: "POST",
            body: JSON.stringify({
                email: "notwindstone@gmail.com",
                username: "notwindstone",
            }),
        });

        if (!response.ok) {
            alert('Response is not ok');

            return;
        }

        const id = (await response.json())?.id;

        emailLetterId.current = id;
        alert(id);

        return;
    }

    return (
        <div className="flex flex-col gap-4">
            <p>
                This page is temporarily client-sided.
            </p>
            <div className="flex flex-col gap-2">
                <p>
                    Currently available buttons {
                        <span className="text-zinc-400">(session token это не session id)</span>
                    }:
                </p>
                <button
                    onClick={async () => {
                        await verifyEmail();
                    }}
                    className="w-fit bg-latte-rosewater text-black rounded px-2 py-1 transition hover:bg-orange-200"
                >
                    Verify email
                </button>
                <button
                    onClick={async () => {
                        await checkEmailLetter();
                    }}
                    className="w-fit bg-latte-rosewater text-black rounded px-2 py-1 transition hover:bg-orange-200"
                >
                    Check email letter
                </button>
                <button
                    onClick={async () => {
                        await sendVerificationCode();
                    }}
                    className="w-fit bg-latte-rosewater text-black rounded px-2 py-1 transition hover:bg-orange-200"
                >
                    Send verification code
                </button>
                <button
                    onClick={async () => {
                        const response = await fetch('/api/login', {
                            method: "POST",
                            body: JSON.stringify({
                                login: "notwindstone",
                                password: "sheet",
                            }),
                        });

                        if (!response.ok) {
                            alert('bruh what are you doing');

                            return;
                        }

                        const data = await response.json();
                        const { sessionToken } = data;

                        setSessionTokenCookie({
                            token: sessionToken,
                            expiresAt: getMonthForwardDate(),
                        }).then(() => {
                            alert('Now you are an authorized user.');
                        });
                    }}
                    className="w-fit bg-latte-rosewater text-black rounded px-2 py-1 transition hover:bg-orange-200"
                >
                    Login using notwindstone&lsquo;s credentials
                </button>
                <button
                    onClick={async () => {
                        await fetch('/api/session/current', {
                            method: "DELETE",
                        });

                        deleteSessionTokenCookie().then(() => alert('Now you are not authorized.'));
                    }}
                    className="w-fit bg-latte-rosewater text-black rounded px-2 py-1 transition hover:bg-orange-200"
                >
                    Remove notwindstone&lsquo;s session token from cookies
                </button>
            </div>
            <div className="flex flex-col">
                <p>
                    Currently available pages:
                </p>
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/dashboard"}>
                    dashboard
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/profile"}>
                    profile
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/profile/notwindstone"}>
                    notwindstone
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/profile/not_existing_user"}>
                    not_existing_user
                </Link>
            </div>
            <div className="flex flex-col">
                <p>
                    Currently available api routes:
                </p>
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/api/profile"}>
                    /api/profile
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/api/profile?username=notwindstone"}>
                    /api/profile?username=notwindstone
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/api/profile?username=not_existing_user"}>
                    /api/profile?username=not_existing_user
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/api/session/current"}>
                    /api/session/current
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/api/session/all"}>
                    /api/session/all
                </Link>
            </div>
            <div className="flex flex-col">
                <p>
                    They are not fully done yet and lack some features. This is a list of some things I want to implement:
                </p>
                <ul className="list-[katakana] pl-10 text-zinc-400">
                    <li>UI, of course</li>
                    <li>/api/login</li>
                    <li>/api/session/all - only GET method</li>
                    <li>Email verification (basically separate codes table in db, actions, Resend API, etc.)</li>
                    <li>Password reset</li>
                    <li>Profile customization</li>
                    <li>Profile picture storage using Cloudinary</li>
                    <li>Server-side Rate limit</li>
                    <li>Client-side Rate limit</li>
                    <li>OAuth2</li>
                    <li>TOTP authentication</li>
                    <li>...more</li>
                </ul>
            </div>
        </div>
    );
}
