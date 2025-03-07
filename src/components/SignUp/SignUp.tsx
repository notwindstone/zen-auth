"use client";

import useSession from "@/hooks/use-session";
import Image from "next/image";
import nextJsLogo from "../../../public/nextjs-icon.svg";
import {REGISTRATION_INPUTS} from "@/configs/constants";
import Link from "next/link";
import checkUser from "@/lib/checkUser";
import {FormEvent, useState} from "react";
import {useRouter} from "nextjs-toploader/app";
import {createVerificationCode} from "@/queries/insert";
import {checkVerificationCodes} from "@/queries/select";

export default function SignUp() {
    const { login } = useSession();
    const [currentFormData, setCurrentFormData] = useState<FormData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDelayed, setDelayed] = useState(false);
    const [userExists, setUserExists] = useState(false);
    const [isBeingVerified, setIsBeingVerified] = useState(false);
    const [areCodesEqual, setAreCodesEqual] = useState(true);
    const router = useRouter();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isDelayed) {
            return;
        }

        setUserExists(false);
        setIsLoading(true);
        setDelayed(true);
        setTimeout(() => {
            setDelayed(false);
        }, 3000);

        const formData = new FormData(event.currentTarget);
        const username = formData?.get("username") as string;
        const email = formData.get("email") as string;

        const { exists } = await checkUser(email);

        if (exists) {
            setUserExists(true);
            setIsLoading(false);

            return;
        }

        setIsBeingVerified(true);
        setCurrentFormData(formData);

        await createVerificationCode({
            email: email,
            username: username,
        });
    }

    async function handleVerificationSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const code = formData?.get("code") as string;

        const email = currentFormData?.get("email") as string;

        const isEqual = await checkVerificationCodes({
            code: code,
            email: email,
        });

        if (!isEqual) {
            setAreCodesEqual(false);

            return;
        }

        const username = currentFormData?.get("username") as string;
        const password = currentFormData?.get("password") as string;

        login({
            username,
            email,
            password,
        }, {
            optimisticData: {
                username,
                email,
                password,
            },
        }).then((updatedSession) => {
            setIsLoading(false);
            setIsBeingVerified(false);

            if (updatedSession.isLoggedIn) {
                router.push('/protected');

                return;
            }

            return;
        });
    }

    if (isBeingVerified) {
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
                    <p className="text-center text-xl font-bold text-black">
                        Подтверждение аккаунта
                    </p>
                    <p className="text-center text-gray-500 font-medium">
                        Введите код, отправленный на почту, чтобы продолжить.
                    </p>
                    <div className="h-[1px] w-full bg-gray-200"/>
                    <form
                        className="w-full flex flex-col gap-2"
                        onSubmit={(event) => handleVerificationSubmit(event)}
                        method="POST"
                    >
                        {
                            !areCodesEqual && (
                                <p
                                    className="text-red-500"
                                >
                                    Код не совпадает.
                                </p>
                            )
                        }
                        <input
                            className="shadow-sm focus:outline-gray-300 focus:-outline-offset-0 outline-transparent focus:outline-none hover:border-gray-300 border-gray-200 border-[1px] rounded-md px-2 py-1 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            type="number"
                            name="code"
                            placeholder=""
                            required
                        />
                        <button
                            type="submit"
                            className="hover:bg-zinc-700 bg-zinc-800 transition mt-2 rounded-md p-2 text-white h-[40px]"
                        >
                            Подтвердить
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    let currentButton;

    if (isLoading || isDelayed) {
        currentButton = (
            <div
                className="bg-zinc-300 cursor-default mt-2 rounded-md p-2 text-white h-[40px]"
            />
        );
    } else {
        currentButton = (
            <button
                type="submit"
                className="hover:bg-zinc-700 bg-zinc-800 transition mt-2 rounded-md p-2 text-white h-[40px]"
            >
                Продолжить
            </button>
        );
    }

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
                <p className="text-center text-xl font-bold text-black">
                    Регистрация аккаунта
                </p>
                <p className="text-center text-gray-500 font-medium">
                    Добро пожаловать! Зарегистрируйтесь, чтобы продолжить.
                </p>
                <div className="h-[1px] w-full bg-gray-200"/>
                <form
                    className="w-full flex flex-col gap-4"
                    onSubmit={(event) => handleSubmit(event)}
                    method="POST"
                >
                    {
                        REGISTRATION_INPUTS.map((currentInput) => {
                            return (
                                <div className="flex flex-col gap-2" key={currentInput.name}>
                                    <p className={`font-semibold ${userExists ? "text-red-500" : "text-gray-800"}`}>
                                        {currentInput.label} {userExists && "(Пользователь существует)"}
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
                    {currentButton}
                </form>
                <p className="text-center text-gray-500 font-medium">
                    Уже есть аккаунт?{' '}
                    <Link
                        className="text-black font-medium"
                        href={"/sign-in"}
                    >
                        Войдите
                    </Link>
                </p>
            </div>
        </div>
    );
}