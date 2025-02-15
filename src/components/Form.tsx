"use client";

import nextJsLogo from '../../public/nextjs-icon.svg'
import useSession from "@/hooks/use-session";
import { defaultSession } from "@/lib/sessions";
import Image from "next/image";
import Link from "next/link";

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

    return <LoginForm />;
}

function LoginForm() {
    const { login } = useSession();

    return (
        <div className="bg-white drop-shadow-xl py-4 px-6 rounded-md">
            <div className="flex flex-col items-center gap-4">
                <Image
                    className="mb-4"
                    width={48}
                    height={48}
                    src={nextJsLogo}
                    alt={"Next.js logo"}
                />
                <p className="text-xl font-bold text-black">
                    Регистрация аккаунта
                </p>
                <p className="text-balance text-center text-gray-500 font-medium">
                    Добро пожаловать! Пожалуйста, зарегистрируйтесь, чтобы продолжить.
                </p>
                <p className="text-gray-500 font-medium">
                    Уже есть аккаунт?{' '}
                    <Link
                        className="text-black font-medium"
                        href={"/auth"}
                    >
                        Войдите
                    </Link>
                </p>
            </div>
            <form
                onSubmit={function (event) {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const username = formData.get("username") as string;
                    const password = formData.get("password") as string;
                    login(username, {
                        optimisticData: {
                            isLoggedIn: true,
                            username,
                            password,
                        },
                    });
                }}
                method="POST"
            >
                <label className="block text-lg">
                    <p>Username</p>
                    <input
                        className="border-pink-200 border-2 px-2 py-1 focus:outline-none focus:border-pink-500"
                        type="text"
                        name="username"
                        placeholder=""
                        defaultValue="notwindstone"
                        required
                    />
                </label>
                <label className="block text-lg">
                    <p>Password</p>
                    <input
                        className="border-pink-200 border-2 px-2 py-1 focus:outline-none focus:border-pink-500"
                        type="password"
                        name="password"
                        placeholder=""
                        required
                    />
                </label>
                <div>
                    <input type="submit" value="Login"/>
                </div>
            </form>
        </div>
    );
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