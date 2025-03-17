"use client";

import { KeyRound } from "lucide-react";
import { FormEvent } from "react";
import PasswordInput from "@/components/PasswordInput/PasswordInput";

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    async function handlePasswordReset(event: FormEvent<HTMLFormElement>) {

    }

    async function checkEmailStatus() {

    }

    async function handleResend() {

    }

    return (
        <>
            <div className="h-fit w-full max-w-[464px] bg-zinc-100 drop-shadow-xl rounded-md">
                <div className="py-6 px-12 rounded-md drop-shadow-sm bg-white">
                    <div className="flex flex-col items-center gap-4">
                        <KeyRound
                            color="black"
                            size={32}
                        />
                        <p className="text-center text-xl font-bold text-black">
                            Новый пароль
                        </p>
                        <div>
                            <p className="text-center text-gray-500 font-medium">
                                Введите новый пароль для аккаунта с почтой:
                            </p>
                            <p className="text-center text-gray-500 font-semibold">
                                {email ?? "отсутствует почта"}
                            </p>
                        </div>
                        <div className="w-full h-[1px] bg-gray-200"/>
                        <form
                            className="w-full flex flex-col gap-4"
                            onSubmit={(event: FormEvent<HTMLFormElement>) => handlePasswordReset(event)}
                            method="POST"
                        >
                            <PasswordInput />
                            <button
                                className={`hover:bg-zinc-700 bg-zinc-800 transition mt-2 rounded-md p-2 text-white h-[40px]`}
                                type="submit"
                            >
                                Продолжить
                            </button>
                        </form>
                    </div>
                </div>
                <div className="py-4 flex flex-col gap-2">
                    <p className="text-center text-gray-500 font-medium">
                        Не пришла ссылка?{' '}
                        <button
                            className="text-black font-medium transition hover:text-zinc-700"
                            onClick={checkEmailStatus}
                        >
                            Проверьте статус письма
                        </button>
                    </p>
                    <div
                        className="w-full px-12 flex flex-nowrap items-center gap-4"
                    >
                        <div className="w-full h-[1px] bg-gray-200"/>
                        <p className="text-gray-500">
                            или
                        </p>
                        <div className="w-full h-[1px] bg-gray-200"/>
                    </div>
                    <p className="text-center text-gray-500 font-medium">
                        <button
                            className="text-black font-medium transition hover:text-zinc-700"
                            onClick={handleResend}
                        >
                            Отправьте код ещё раз
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
}