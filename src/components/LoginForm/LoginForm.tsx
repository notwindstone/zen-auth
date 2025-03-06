"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import {setSessionTokenCookie} from "@/lib/actions/cookies";
import {getMonthForwardDate} from "@/utils/misc/getMonthForwardDate";
import {FormEvent} from "react";
import {API_ROUTES, API_STATUS_CODES} from "@/configs/api";
import {useRouter} from "nextjs-toploader/app";
import {useQuery} from "@tanstack/react-query";
import {TableSessionType, TableUserType} from "@/db/schema";
import {NO_RETRY_ERRORS} from "@/configs/constants";

export default function LoginForm() {
    const router = useRouter();
    const {
        isPending,
        error,
        failureCount,
        failureReason,
    } = useQuery({
        queryKey: [API_ROUTES.session.current],
        queryFn: async (): Promise<{
            session: TableSessionType;
            user: TableUserType;
        }> => {
            const response = await fetch(API_ROUTES.session.current);

            if (!response.ok) {
                return Promise.reject(
                    new Error(
                        response.status.toString(),
                    ),
                );
            }

            return await response.json();
        },
        retry: (failureCount, error) => {
            return !(NO_RETRY_ERRORS.has(Number(error.message)) || failureCount > 3);
        },
    });

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");

        // passwords in the form are provided as plain text.
        // HTTPS will handle everything, no need to encrypt it here.
        // and of course passwords are being stored in database only after hashing and salting
        const password = formData.get("password");

        if (!email || !password) {
            // TODO
            alert('you are stupid')

            return;
        }

        const response = await fetch(API_ROUTES.login, {
            method: "POST",
            body: JSON.stringify({
                login: email,
                password: password,
            }),
        });

        if (!response.ok) {
            // TODO
            alert('bruh what are you doing');

            return;
        }

        const data = await response.json();
        const { sessionToken } = data;

        setSessionTokenCookie({
            token: sessionToken,
            expiresAt: getMonthForwardDate(),
        }).then(() => {
            router.push('/profile');
        });
    }

    if (isPending) {
        return (
            <div>
                <p>
                    Loading...
                </p>
                {
                    failureCount > 0 && (
                        <p>
                            {failureCount} retries. Current error: {failureReason?.message}
                        </p>
                    )
                }
            </div>
        );
    }

    if (error?.message === API_STATUS_CODES.ERROR.UNAUTHORIZED.toString()) {
        return (
            <div className="h-fit w-fit bg-zinc-100 drop-shadow-xl rounded-md">
                <div className="py-6 px-12 rounded-md drop-shadow-sm bg-white">
                    <div className="flex flex-col items-center gap-4">
                        <Shield
                            color="black"
                            size={32}
                        />
                        <p className="text-center text-xl font-bold text-black">
                            Авторизация
                        </p>
                        <p className="text-center text-gray-500 font-medium">
                            Добро пожаловать! Войдите, чтобы продолжить.
                        </p>
                        <div
                            className="w-full flex flex-nowrap items-center gap-4"
                        >
                            <div className="w-full h-[1px] bg-gray-200" />
                            <p className="text-zinc-700">
                                или
                            </p>
                            <div className="w-full h-[1px] bg-gray-200" />
                        </div>
                        <form
                            className="w-full flex flex-col gap-4"
                            onSubmit={(event: FormEvent<HTMLFormElement>) => handleSubmit(event)}
                            method="POST"
                        >
                            <div className="flex flex-col gap-2">
                                <p className={`font-semibold text-zinc-800`}>
                                    Почта
                                </p>
                                <input
                                    className={`shadow-sm focus:outline-gray-300 focus:-outline-offset-0 outline-transparent focus:outline-none hover:border-gray-300 border-gray-200 border-[1px] rounded-md px-2 py-1 transition-all text-black`}
                                    type={"email"}
                                    name={"email"}
                                    placeholder=""
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className={`font-semibold text-zinc-800`}>
                                    Пароль
                                </p>
                                <input
                                    className={`shadow-sm focus:outline-gray-300 focus:-outline-offset-0 outline-transparent focus:outline-none hover:border-gray-300 border-gray-200 border-[1px] rounded-md px-2 py-1 transition-all text-black`}
                                    type={"password"}
                                    name={"password"}
                                    placeholder=""
                                    required
                                />
                            </div>
                            <button
                                className={`hover:bg-zinc-700 bg-zinc-800 transition mt-2 rounded-md p-2 text-white h-[40px]`}
                                type="submit"
                            >
                                Продолжить
                            </button>
                        </form>
                    </div>
                </div>
                <div className="py-4">
                    <p className="text-center text-gray-500 font-medium">
                        Ещё нет аккаунта?{' '}
                        <Link
                            className="text-black font-medium transition hover:text-zinc-700"
                            href={""}
                        >
                            Зарегистрируйтесь
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <p>
                    An error has occurred: {error.message}
                </p>
            </div>
        );
    }


    return (
        <div>
            <p>
                You are logged in.
            </p>
        </div>
    );
}