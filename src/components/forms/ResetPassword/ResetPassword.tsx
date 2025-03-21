"use client";

import { KeyRound } from "lucide-react";
import { FormEvent } from "react";
import PasswordInput from "@/components/forms/Inputs/PasswordInput/PasswordInput";

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    async function handlePasswordReset(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const password = formData.get("password");

        if (!password) {
            alert("Please enter a password");
        }

        const response = await fetch('/api/reset', {
            method: "PUT",
            body: JSON.stringify({
                email: email,
                newPassword: password,
                resetToken: token,
            }),
        });

        if (!response.ok) {
            alert('Response is not ok');

            return;
        }

        alert("Truth.");
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
                            <PasswordInput isError={false} errorText={""} />
                            <button
                                className={`hover:bg-zinc-700 bg-zinc-800 transition mt-2 rounded-md p-2 text-white h-[40px]`}
                                type="submit"
                            >
                                Продолжить
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}