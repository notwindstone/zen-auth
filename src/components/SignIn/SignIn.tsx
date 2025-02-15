"use client";

import useSession from "@/hooks/use-session";
import Image from "next/image";
import nextJsLogo from "../../../public/nextjs-icon.svg";
import {LOGIN_INPUTS} from "@/app/configs/constants";
import Link from "next/link";
import checkUser from "@/lib/checkUser";
import {FormEvent, useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function SignIn() {
    const { login, session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [isDelayed, setDelayed] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isDelayed) {
            return;
        }

        setIsLoading(true);
        setDelayed(true);
        setTimeout(() => {
            setDelayed(false);
        }, 3000);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const userExists = await checkUser(email);

        login({
            email,
            password,
            isSignIn: true,
        }, {
            optimisticData: {
                isLoggedIn: true,
                email,
                password,
            },
        });

        setIsLoading(false)
    }

    useEffect(() => {
        if (session.isLoggedIn) {
            router.push("/");
        }
    }, [session]);

    return (
        <div className="bg-white drop-shadow-xl py-6 px-12 rounded-md">
            <div className="flex flex-col items-center gap-4">
                <Image
                    className="mb-4"
                    width={48}
                    height={48}
                    src={nextJsLogo}
                    alt={"Next.js logo"}
                />
                <p className="text-xl font-bold text-black">
                    Авторизация
                </p>
                <p className="text-center text-gray-500 font-medium">
                    Добро пожаловать! Войдите, чтобы продолжить.
                </p>
                <div className="h-[1px] w-full bg-gray-200" />
                <form
                    className="w-full flex flex-col gap-4"
                    onSubmit={(event) => handleSubmit(event)}
                    method="POST"
                >
                    {
                        LOGIN_INPUTS.map((currentInput) => {
                            return (
                                <div className="flex flex-col gap-2" key={currentInput.name}>
                                    <p className="font-semibold text-gray-800">
                                        {currentInput.label}
                                    </p>
                                    <input
                                        className="shadow-sm focus:outline-gray-300 focus:-outline-offset-0 outline-transparent focus:outline-none hover:border-gray-300 border-gray-200 border-[1px] rounded-md px-2 py-1 transition-all"
                                        type={currentInput.type}
                                        name={currentInput.name}
                                        placeholder=""
                                        required
                                    />
                                </div>
                            );
                        })
                    }
                    {
                        <button
                            className={`${isLoading || isDelayed ? "hover:bg-zinc-300 bg-zinc-300 cursor-default" : "hover:bg-zinc-700 bg-zinc-800"} transition mt-2 rounded-md p-2 text-white h-[40px]`}
                            type="submit"
                        >
                            {
                                (!isLoading && !isDelayed) && "Продолжить"
                            }
                        </button>
                    }
                </form>
                <p className="text-gray-500 font-medium">
                    Ещё нет аккаунта?{' '}
                    <Link
                        className="text-black font-medium"
                        href={"/sign-up"}
                    >
                        Зарегистрируйтесь
                    </Link>
                </p>
            </div>
        </div>
    );
}