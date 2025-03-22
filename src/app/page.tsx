"use client";

import Link from "next/link";
import { API_ROUTES } from "@/configs/api";

export default function Page() {
    return (
        <div className="flex flex-col gap-4">
            <p>
                This page is temporarily client-sided.
            </p>
            <button
                onClick={() => {
                    for (let i = 0; i < Math.pow(10, 3); i++) {
                        fetch(API_ROUTES.PROFILE);

                        /*
                        fetch('https://zen-auth.windstone.space/api/profile?username=notwindstone');
                        fetch('https://zen-auth.windstone.space/api/login', {
                            method: "POST",
                        });
                        fetch('https://zen-auth.windstone.space/api/verification', {
                            method: "POST",
                        });
                        fetch('https://zen-auth.windstone.space/api/reset', {
                            method: "POST",
                        });
                         */
                    }
                }}
                className="bg-amber-950 w-fit py-2 px-4"
            >
                run http requests flood?
            </button>
            <Link href="/register" className="text-lg hover:text-gray-300 transition">
                ~~~ {">"} here {"<"} ~~~
            </Link>
            <div className="flex flex-col gap-2">
                <p>
                    Dev buttons {
                        <span className="text-zinc-400">(бля почему на английском фразы менее кринжово звучат, даже если смысл один)</span>
                    }:
                </p>
                <button
                    onClick={async () => {
                        const response = await fetch('/api/session/all', {
                            method: "DELETE",
                        });

                        if (!response.ok) {
                            alert('Response is not ok');

                            return;
                        }

                        alert("Truth.");
                    }}
                    className="w-fit bg-latte-rosewater text-black rounded px-2 py-1 transition hover:bg-orange-200"
                >
                    Remove all sessions except current
                </button>
                <div
                    className="w-fit bg-amber-950 text-white rounded px-2 py-1 transition "
                >
                    Reset password
                </div>
                <div
                    className="w-fit bg-amber-950 text-white rounded px-2 py-1 transition "
                >
                    Send reset token
                </div>
                <div
                    className="w-fit bg-amber-950 text-white rounded px-2 py-1 transition "
                >
                    Verify email
                </div>
                <div
                    className="w-fit bg-amber-950 text-white rounded px-2 py-1 transition "
                >
                    Check email letter
                </div>
                <div
                    className="w-fit bg-amber-950 text-white rounded px-2 py-1 transition"
                >
                    Send verification code
                </div>
                <div
                    className="w-fit bg-amber-950 text-white rounded px-2 py-1 transition"
                >
                    Log out
                </div>
                <div
                    className="w-fit bg-amber-950 text-white rounded px-2 py-1 transition"
                >
                    Log in using notwindstone&lsquo;s credentials
                </div>
            </div>
            <div className="flex flex-col">
                <p>
                    Currently available pages:
                </p>
                <Link className="text-zinc-400 transition hover:text-zinc-200 before:content-['■'] before:pr-2 before:text-latte-rosewater" href={"/dashboard"}>
                    dashboard
                </Link>
                <Link className="before:content-['▢'] before:pr-2 before:text-latte-rosewater text-zinc-400 transition hover:text-zinc-200" href={"/profile"}>
                    profile
                </Link>
                <Link className="before:content-['▢'] before:pr-2 before:text-latte-rosewater text-zinc-400 transition hover:text-zinc-200" href={"/profile/notwindstone"}>
                    profile/notwindstone
                </Link>
                <Link className="before:content-['▢'] before:pr-2 before:text-latte-rosewater text-zinc-400 transition hover:text-zinc-200" href={"/profile/not_existing_user"}>
                    profile/not_existing_user
                </Link>
                <Link className="before:content-['▢'] before:pr-2 before:text-latte-rosewater text-zinc-400 transition hover:text-zinc-200" href={"/sessions"}>
                    sessions
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200 before:content-['■'] before:pr-2 before:text-latte-rosewater" href={"/login"}>
                    login
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200 before:content-['■'] before:pr-2 before:text-latte-rosewater" href={"/register"}>
                    register
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200 before:content-['■'] before:pr-2 before:text-latte-rosewater" href={"/verification"}>
                    verification
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200 before:content-['■'] before:pr-2 before:text-latte-rosewater" href={"/reset"}>
                    reset
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200 before:content-['■'] before:pr-2 before:text-latte-rosewater" href={"/reset/send"}>
                    reset/send
                </Link>
                <Link className="text-zinc-400 transition hover:text-zinc-200 before:content-['■'] before:pr-2 before:text-latte-rosewater" href={"/reset/send"}>
                    reset/emailed
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
                <Link className="text-zinc-400 transition hover:text-zinc-200" href={"/api/session/all"}>
                    /api/session/specific - DELETE
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
                    <li>
                        this is peak:
                        для неавторизованных пользователей глобальный рейтлимит на основе lru-cache и локальный на основе айпи, который получается из vercel функций (а не хедеров)
                        для авторизованных пользователей рейтлимит на основе хэша, который представляет из себя юзер айди и данные сессии (по типу браузера, операционной системы)
                    </li>
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
                    <li>...more</li>
                </ul>
            </div>
        </div>
    );
}
