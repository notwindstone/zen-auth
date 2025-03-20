"use client";

import { CircleAlert, Signature } from "lucide-react";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { API_REQUEST_METHODS, API_ROUTES } from "@/configs/api";
import { useRouter } from "nextjs-toploader/app";
import { getLastEmailInfo } from "@/lib/actions/email";
import { setSessionTokenCookie } from "@/lib/actions/cookies";
import { getMonthForwardDate } from "@/utils/misc/getMonthForwardDate";
import { STYLES_ERROR_INITIAL_DATA, STYLES_ERROR_TYPES } from "@/configs/constants";
import PasswordInput from "@/components/forms/Inputs/PasswordInput/PasswordInput";
import validateEmail from "@/utils/secure/validateEmail";
import translateEmailStatus from "@/utils/misc/translateEmailStatus";
import { useImmer } from "use-immer";
import { StylesErrorType } from "@/types/UI/StylesError.type";
import { PAGE_ROUTES } from "@/configs/pages";
import GeneralForm from "@/components/forms/GeneralForm/GeneralForm";
import OTPInput from "@/components/forms/Inputs/OTPInput/OTPInput";

export default function CodeVerification({
    username,
    email,
    emailLetterId,
    token,
}: {
    username: string | null;
    email: string | null;
    emailLetterId: string | null;
    token: string;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState({
        submit: false,
        email: false,
    });
    const [emailLetterData, setEmailLetterData] = useState({
        show: false,
        status: "",
    });
    const [styles, setStyles] = useImmer<StylesErrorType>({
        rtl: STYLES_ERROR_INITIAL_DATA,
        username: STYLES_ERROR_INITIAL_DATA,
        email: STYLES_ERROR_INITIAL_DATA,
        code: STYLES_ERROR_INITIAL_DATA,
        password: STYLES_ERROR_INITIAL_DATA,
    });

    async function checkEmailStatus() {
        if (isLoading.email) {
            return;
        }

        setIsLoading((state) => {
            return {
                ...state,
                email: true,
            };
        });

        setEmailLetterData({
            show: true,
            status: "",
        });

        const emailStatus = await getLastEmailInfo({ id: emailLetterId as string });

        setEmailLetterData({
            show: true,
            status: translateEmailStatus({ status: emailStatus }),
        });

        setIsLoading((state) => {
            return {
                ...state,
                email: false,
            };
        });
    }

    async function handleResend() {
        if (isLoading.submit) {
            return;
        }

        setIsLoading({
            submit: true,
            email: true,
        });
        setStyles((draft) => {
            draft.username = STYLES_ERROR_INITIAL_DATA;
            draft.email = STYLES_ERROR_INITIAL_DATA;
            draft.rtl = STYLES_ERROR_INITIAL_DATA;
            draft.code = STYLES_ERROR_INITIAL_DATA;
            draft.password = STYLES_ERROR_INITIAL_DATA;
        });

        if (!username || !email) {
            setStyles((draft) => {
                draft.username = {
                    error: !Boolean(username),
                    text: STYLES_ERROR_TYPES.NO_LOGIN,
                };
                draft.email = {
                    error: !Boolean(email),
                    text: STYLES_ERROR_TYPES.NO_LOGIN,
                };
            });
            setIsLoading({
                submit: false,
                email: false,
            });

            return;
        }

        const response = await fetch(API_ROUTES.VERIFICATION, {
            method: API_REQUEST_METHODS.POST,
            body: JSON.stringify({
                username: username,
                email: email,
            }),
        });

        if (!response.ok) {
            // TODO
            alert('bruh what are you doing');

            setIsLoading({
                submit: false,
                email: false,
            });

            return;
        }

        const emailLetterId = (await response.json())?.id;

        router.push(`/verification?username=${username}&email=${email}&id=${emailLetterId}`);

        setIsLoading({
            submit: false,
            email: false,
        });
        setEmailLetterData({
            show: false,
            status: "",
        });
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (isLoading.submit) {
            return;
        }

        setIsLoading((state) => {
            return {
                ...state,
                submit: true,
            };
        });
        setStyles((draft) => {
            draft.username = STYLES_ERROR_INITIAL_DATA;
            draft.email = STYLES_ERROR_INITIAL_DATA;
            draft.rtl = STYLES_ERROR_INITIAL_DATA;
            draft.code = STYLES_ERROR_INITIAL_DATA;
            draft.password = STYLES_ERROR_INITIAL_DATA;
        });

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

        const verificationCode = otp.join('');

        if (verificationCode.length !== 6) {
            setStyles((draft) => {
                draft.code = {
                    error: Boolean(username),
                    text: STYLES_ERROR_TYPES.NO_CODE,
                };
            });
            setIsLoading((state) =>{
                return {
                    ...state,
                    submit: false,
                };
            });

            return;
        }

        const verificationResponse = await fetch(API_ROUTES.VERIFICATION, {
            method: API_REQUEST_METHODS.PUT,
            body: JSON.stringify({
                email: email,
                code: verificationCode,
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

        const loginResponse = await fetch(API_ROUTES.LOGIN, {
            method: API_REQUEST_METHODS.POST,
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
            router.push(PAGE_ROUTES.PROFILE.ROOT);
        });
    }

    return (
        <GeneralForm token={token}>
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
                            onSubmit={handleSubmit}
                            method="POST"
                        >
                            <OTPInput isError={styles.code.error} errorText={styles.code.text} />
                            <PasswordInput/>
                            {
                                (styles.rtl.error) && (
                                    <div className="text-red-400 text-sm flex gap-2 items-center">
                                        <CircleAlert className="shrink-0" size={20}/>
                                        <p>
                                            {styles.rtl.text}
                                        </p>
                                    </div>
                                )
                            }
                            {
                                isLoading.submit ? (
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
                    {
                        emailLetterData.show && (
                            <div className="w-full px-12 py-2">
                                {
                                    isLoading.email ? (
                                        <div
                                            className="rounded-md w-full h-16 border-[1px] border-gray-200 bg-gray-200 animate-pulse"
                                        />
                                    ) : (
                                        <div
                                            className="rounded-md w-full h-16 bg-white border-[1px] border-gray-200 flex items-center justify-center text-center text-lg font-semibold text-black"
                                        >
                                            {emailLetterData.status}
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
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
                    {
                        (styles.username.error || styles.email.error) && (
                            <div className="text-red-400 text-center mx-auto text-sm flex gap-2 items-center">
                                <CircleAlert className="shrink-0" size={20}/>
                                <p>
                                    {styles.username.text ?? styles.email.text}
                                </p>
                            </div>
                        )
                    }
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
        </GeneralForm>
    );
}