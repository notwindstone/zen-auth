"use client";

import { useSearchParams } from "next/navigation";
import { Shield } from "lucide-react";
import {FormEvent, useRef, useState} from "react";
import Link from "next/link";
import { API_ROUTES } from "@/configs/api";
import { useRouter } from "nextjs-toploader/app";
import { getLastEmailInfo } from "@/lib/actions/email";
import { setSessionTokenCookie } from "@/lib/actions/cookies";
import { getMonthForwardDate } from "@/utils/misc/getMonthForwardDate";
import { CODE_DIGITS_COUNT } from "@/configs/constants";

export default function CodeVerification() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const username = searchParams.get("username");
    const email = searchParams.get("email");
    const emailLetterId = searchParams.get("id");

    const [otp, setOtp] = useState(Array(CODE_DIGITS_COUNT).fill(""));
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const handleKeyDown = (event: KeyboardEvent) => {
        if (
            !/^[0-9]{1}$/.test(event.key)
            && event.key !== "Backspace"
            && event.key !== "Delete"
            && event.key !== "Tab"
            && !event.metaKey
        ) {
            event.preventDefault();
        }

        const index = inputRefs.current.indexOf(event?.target);

        if (event.key === "Delete" || event.key === "Backspace") {
            if (index >= 0) {
                setOtp((prevOtp) => [
                    ...prevOtp.slice(0, index),
                    "",
                    ...prevOtp.slice(index + 1),
                ]);

                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleInput = (event: KeyboardEvent) => {
        const { currentTarget } = event;
        const index = inputRefs.current.indexOf(currentTarget);

        if (currentTarget?.value) {
            setOtp((prevOtp) => [
                ...prevOtp.slice(0, index),
                currentTarget?.value,
                ...prevOtp.slice(index + 1),
            ]);

            if (index < otp.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleFocus = (event) => {
        event.target.select();
    };

    const handlePaste = (event) => {
        event.preventDefault();

        const text = event.clipboardData.getData("text");

        if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) {
            return;
        }

        const digits = text.split("");

        setOtp(digits);
    };

    async function checkEmailStatus() {
        alert(JSON.stringify(await getLastEmailInfo({ id: emailLetterId as string })));
    }

    async function handleResend() {
        if (!username || !email) {
            // TODO
            alert('you are stupid');

            return;
        }

        const response = await fetch(API_ROUTES.verification, {
            method: "POST",
            body: JSON.stringify({
                username: username,
                email: email,
            }),
        });

        if (!response.ok) {
            // TODO
            alert('bruh what are you doing');

            return;
        }

        const emailLetterId = (await response.json())?.id;

        router.push(`/verification?username=${username}&email=${email}&id=${emailLetterId}`);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const password = formData.get("password");

        if (!username || !email || !emailLetterId || !password) {
            // TODO
            alert('you are stupid');

            return;
        }

        const verificationResponse = await fetch(API_ROUTES.verification, {
            method: "PUT",
            body: JSON.stringify({
                email: email,
                code: otp.join(''),
                username: username,
                displayName: username,
                password: password,
            }),
        });

        if (!verificationResponse.ok) {
            // TODO
            alert('bruh what are you doing');

            return;
        }

        const loginResponse = await fetch(API_ROUTES.login, {
            method: "POST",
            body: JSON.stringify({
                login: username,
                password: password,
            }),
        });

        if (!loginResponse.ok) {
            // TODO
            alert('registration was successful, but login failed');

            return;
        }

        const data = await loginResponse.json();
        const { sessionToken } = data;

        setSessionTokenCookie({
            token: sessionToken,
            expiresAt: getMonthForwardDate(),
        }).then(() => {
            router.push('/profile');
        });
    }

    return (
        <div className="h-fit w-fit bg-zinc-100 drop-shadow-xl rounded-md">
            <div className="py-6 px-12 rounded-md drop-shadow-sm bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Shield
                        color="black"
                        size={32}
                    />
                    <p className="text-center text-xl font-bold text-black">
                        Верификация
                    </p>
                    <p className="text-center text-gray-500 font-medium">
                        Код верификации был выслан на вашу почту.
                    </p>
                    <div className="w-full h-[1px] bg-gray-200"/>
                    <form
                        className="w-full flex flex-col gap-4"
                        onSubmit={(event: FormEvent<HTMLFormElement>) => handleSubmit(event)}
                        method="POST"
                    >
                        <div className="flex flex-col gap-2">
                            <p className={`font-semibold text-zinc-800`}>
                                Код
                            </p>
                            <div className="flex gap-2">
                                {
                                    otp.map((digit, index) => {
                                        return (
                                            <input
                                                ref={(el) => (inputRefs.current[index] = el)}
                                                key={index}
                                                className={`w-8 text-center shadow-sm focus:outline-gray-300 focus:-outline-offset-0 outline-transparent focus:outline-none hover:border-gray-300 border-gray-200 border-[1px] rounded-md py-1 transition-all text-black`}
                                                type={"text"}
                                                name={`code_${index}`}
                                                placeholder=""
                                                maxLength={1}
                                                value={digit}
                                                onChange={handleInput}
                                                onKeyDown={handleKeyDown}
                                                onFocus={handleFocus}
                                                onPaste={handlePaste}
                                                required
                                            />
                                        );
                                    })
                                }
                            </div>
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
            <div className="py-4 flex flex-col gap-2">
                <p className="text-center text-gray-500 font-medium">
                    Не пришёл код?{' '}
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
                    <Link
                        className="text-black font-medium transition hover:text-zinc-700"
                        href={`/register?username=${username ?? ""}&email=${email ?? ""}`}
                    >
                        Измените данные
                    </Link>
                </p>
            </div>
        </div>
    );
}