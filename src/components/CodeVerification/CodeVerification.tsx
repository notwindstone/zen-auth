"use client";

import { Signature } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { API_ROUTES } from "@/configs/api";
import { useRouter } from "nextjs-toploader/app";
import { getLastEmailInfo } from "@/lib/actions/email";
import { setSessionTokenCookie } from "@/lib/actions/cookies";
import { getMonthForwardDate } from "@/utils/misc/getMonthForwardDate";
import { CODE_DIGITS_COUNT } from "@/configs/constants";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import validateEmail from "@/utils/secure/validateEmail";

export default function CodeVerification({
    username,
    email,
    emailLetterId,
}: {
    username: string | null;
    email: string | null;
    emailLetterId: string | null;
}) {
    const router = useRouter();
    const [isEmailShowing, setIsEmailShowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState<Array<string | number>>(Array(CODE_DIGITS_COUNT).fill(""));
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    function handleChange(index: number, value: string) {
        if (![0,1,2,3,4,5,6,7,8,9].includes(Number(value))) {
            return;
        }

        setOtp((prevOtp: Array<string | number>) => {
            const newOtp = [...prevOtp];

            newOtp[index] = value.replace(/[^0-9]/g, "");

            return newOtp;
        });

        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleBackspace(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
        if (!event.target || !('value' in event.target)) {
            return;
        }

        if (event.key === "Backspace" && !event.target.value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
        event.preventDefault();

        const clipboardValue = event.clipboardData.getData("text/plain") as string;
        const trimmedValue = clipboardValue.trim();

        if (isNaN(Number(trimmedValue))) {
            return;
        }

        const newOtp = trimmedValue.split('');
        const slicedOtp = newOtp.slice(0, 6);

        for (let i = slicedOtp.length; i < otp.length; i++) {
            slicedOtp.push("");
        }

        setOtp(slicedOtp);
    }

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

        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const password = formData.get("password");

        if (!username || !email || !emailLetterId || !password) {
            // TODO
            alert('you are stupid');

            return;
        }

        const isValidEmail = validateEmail({ email });

        if (!isValidEmail) {
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
        console.log(loginResponse);
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
        <div className="h-fit w-full max-w-[464px] bg-zinc-100 drop-shadow-xl rounded-md">
            <div className="py-6 px-12 rounded-md drop-shadow-sm bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Signature
                        color="black"
                        size={32}
                    />
                    <p className="text-center text-xl font-bold text-black">
                        Верификация
                    </p>
                    <div>
                        <p className="text-center text-gray-500 font-medium">
                            Код верификации был выслан на вашу почту:
                        </p>
                        <p className="text-center text-gray-500 font-semibold">
                            {email ?? "отсутствует почта"}
                        </p>
                    </div>
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
                            <div className="flex w-full gap-2">
                                {
                                    otp.map((digit, index) => {
                                        return (
                                            <input
                                                ref={(el) => {
                                                    inputRefs.current[index] = el;
                                                }}
                                                autoFocus={index === 0}
                                                key={index}
                                                className={`h-16 w-full text-center shadow-sm focus:outline-gray-300 focus:-outline-offset-0 outline-transparent focus:outline-none hover:border-gray-300 border-gray-200 border-[1px] rounded-md transition-all text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                                type={"text"}
                                                name={`code_${index}`}
                                                placeholder=""
                                                pattern="\d*"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleBackspace(index, e)}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
                                                onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => handlePaste(e)}
                                                required
                                            />
                                        );
                                    })
                                }
                            </div>
                        </div>
                        <PasswordInput/>
                        {
                            isLoading ? (
                                <div
                                    className="h-[40px] w-full mt-2 transition animate-pulse bg-zinc-400 rounded-md"/>
                            ) : (
                                <button
                                    className={`hover:bg-zinc-700 bg-zinc-800 transition mt-2 rounded-md p-2 text-white h-[40px]`}
                                    type="submit"
                                >
                                    Продолжить
                                </button>
                            )
                        }
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
                    className=""
                >

                </div>
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