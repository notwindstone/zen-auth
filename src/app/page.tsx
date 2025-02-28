"use client";

import Link from "next/link";
import { deleteSessionTokenCookie, setSessionTokenCookie } from "@/lib/actions/cookies";
import { getLastEmailInfo } from "@/lib/actions/email";
import { useRef, useState } from "react";
import { getMonthForwardDate } from "@/utils/misc/getMonthForwardDate";

export default function Page() {
    const emailLetterId = useRef('');
    const isVerified = useRef(false);
    const [isSignedIn, setIsSignedIn] = useState(false);

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
        const response = await getLastEmailInfo({
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
                        <span className="text-zinc-400">(бля почему на английском фразы менее кринжово звучат, даже если смысл один)</span>
                    }:
                </p>
                <button
                    onClick={async () => {
                        const response = await fetch('/api/reset', {
                            method: "PUT",
                            body: JSON.stringify({
                                email: 'notwindstone@gmail.com',
                                newPassword: "sheesh",
                                resetToken: "bBxmKUrkfZAXrrcAKOsMnhYLgExgmDWjlHhLsoXHxmVPPAmILYheRreYtGMIfijh",
                            }),
                        });

                        if (!response.ok) {
                            alert('Response is not ok');

                            return;
                        }

                        alert("Truth.");
                    }}
                    className="w-fit bg-latte-rosewater text-black rounded px-2 py-1 transition hover:bg-orange-200"
                >
                    Reset password
                </button>
                <button
                    onClick={async () => {
                        const response = await fetch('/api/reset', {
                            method: "POST",
                            body: JSON.stringify({
                                email: 'notwindstone@gmail.com',
                            }),
                        });

                        if (!response.ok) {
                            alert('Response is not ok');

                            return;
                        }

                        alert("Truth.");
                    }}
                    className="w-fit bg-latte-rosewater text-black rounded px-2 py-1 transition hover:bg-orange-200"
                >
                    Send reset token
                </button>
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
                {
                    isSignedIn ? (
                        <button
                            onClick={async () => {
                                setIsSignedIn(false);

                                await fetch('/api/session/current', {
                                    method: "DELETE",
                                });

                                deleteSessionTokenCookie().then(() => alert('Now you are not authorized.'));
                            }}
                            className="w-fit bg-latte-rosewater text-black rounded px-2 py-1 transition hover:bg-orange-200"
                        >
                            Log out
                        </button>
                    ) : (
                        <button
                            onClick={async () => {
                                setIsSignedIn(true);

                                const response = await fetch('/api/login', {
                                    method: "POST",
                                    body: JSON.stringify({
                                        login: "notwindstone",
                                        password: "sheesh",
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
                            Log in using notwindstone&lsquo;s credentials
                        </button>
                    )
                }
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
                    profile/notwindstone
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/profile/not_existing_user"}>
                    profile/not_existing_user
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/sessions"}>
                    sessions
                </Link>
            </div>
            <div className="flex flex-col">
                <p>
                    Currently available api routes:
                </p>
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/api/profile"}>
                    /api/profile - GET
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/api/profile?username=notwindstone"}>
                    /api/profile?username=notwindstone - GET
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/api/profile?username=not_existing_user"}>
                    /api/profile?username=not_existing_user - GET
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/api/session/current"}>
                    /api/session/current - GET, DELETE
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/api/session/all"}>
                    /api/session/all - GET, DELETE
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/api/login"}>
                    /api/login - POST
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/api/verification"}>
                    /api/verification - POST (verification code creation), PUT (account verification and creation)
                </Link>
            </div>
            <div className="flex flex-col">
                <p>
                    They are not fully done yet and lack some features. This is a list of some things I want to implement:
                </p>
                <ul className="list-[katakana] pl-10 text-zinc-400">
                    <li
                        className="before:content-['▢'] before:pr-2 before:text-latte-rosewater"
                    >
                        UI, of course
                    </li>
                    <li
                        className="before:content-['■'] before:pr-2 before:text-latte-rosewater"
                    >
                        Password reset
                    </li>
                    <li>Profile customization</li>
                    <li>Profile picture storage using Cloudinary</li>
                    <li
                        className="before:content-['■'] before:pr-2 before:text-latte-rosewater"
                    >
                        Server-side Rate limit
                    </li>
                    <li>Client-side Rate limit</li>
                    <li>OAuth2</li>
                    <li>TOTP authentication</li>
                    <li>...more</li>
                </ul>
            </div>
        </div>
    );
}
