"use client";

import { useRouter } from "nextjs-toploader/app";
import { API_REQUEST_METHODS, API_ROUTES } from "@/configs/api";
import { STYLES_ERROR_INITIAL_DATA, STYLES_ERROR_TYPES } from "@/configs/constants";
import { FormEvent, useState } from "react";
import { SquareAsterisk } from "lucide-react";
import Link from "next/link";
import validateEmail from "@/utils/secure/validateEmail";
import { StylesErrorType } from "@/types/UI/StylesError.type";
import { useImmer } from "use-immer";
import GeneralForm from "@/components/forms/GeneralForm/GeneralForm";
import getStylesErrorData from "@/utils/queries/getStylesErrorData";
import { PAGE_ROUTES } from "@/configs/pages";
import { TurnstileStatusType } from "@/types/Auth/TurnstileStatus.type";
import AlertBlock from "@/components/misc/AlertBlock/AlertBlock";
import ConfiguredTurnstile from "@/components/forms/ConfiguredTurnstile/ConfiguredTurnstile";
import { v4 as uuid } from "uuid";
import handleTurnstileReset from "@/utils/secure/handleTurnstileReset";
import OAuth2Providers from "@/components/forms/OAuth2Providers/OAuth2Providers";

export default function RegisterForm({
    token,
    usernamePlaceholder,
    emailPlaceholder,
}: {
    token: string;
    usernamePlaceholder: string;
    emailPlaceholder: string;
}) {
    const router = useRouter();
    const [turnstileKey, setTurnstileKey] = useState<string>(uuid);
    const [turnstileStatus, setTurnstileStatus] = useState<TurnstileStatusType | null>("required");
    const [isLoading, setIsLoading] = useState(false);
    const [styles, setStyles] = useImmer<
        Pick<
            StylesErrorType,
            "rtl" | "username" | "email" | "turnstile"
        >
    >({
        rtl: STYLES_ERROR_INITIAL_DATA,
        username: STYLES_ERROR_INITIAL_DATA,
        email: STYLES_ERROR_INITIAL_DATA,
        turnstile: STYLES_ERROR_INITIAL_DATA,
    });

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (isLoading) {
            return;
        }

        setIsLoading(true);
        setStyles((draft) => {
            draft.rtl = STYLES_ERROR_INITIAL_DATA;
            draft.username = STYLES_ERROR_INITIAL_DATA;
            draft.email = STYLES_ERROR_INITIAL_DATA;
        });

        if (turnstileStatus !== "success") {
            setIsLoading(false);

            return;
        }

        const formData = new FormData(event.currentTarget);
        const token = formData.get("cf-turnstile-response");
        const username = formData.get("username");
        const email = formData.get("email");

        if (!token) {
            setStyles((draft) => {
                draft.turnstile = {
                    error: true,
                    text: STYLES_ERROR_TYPES.TURNSTILE_ERROR,
                };
            });
            setIsLoading(false);

            return;
        }

        if (!username || !email) {
            setStyles((draft) => {
                draft.username = {
                    error: !Boolean(username),
                    text: STYLES_ERROR_TYPES.NO_NICKNAME,
                };
                draft.email = {
                    error: !Boolean(email),
                    text: STYLES_ERROR_TYPES.NO_EMAIL,
                };
            });
            setIsLoading(false);

            return;
        }

        const isValidEmail = validateEmail({ email });

        if (!isValidEmail) {
            setStyles((draft) => {
                draft.email = {
                    error: true,
                    text: STYLES_ERROR_TYPES.EMAIL_FORMAT,
                };
            });
            setIsLoading(false);

            return;
        }

        const response = await fetch(API_ROUTES.VERIFICATION, {
            method: API_REQUEST_METHODS.POST,
            body: JSON.stringify({
                username: username,
                email: email,
                token: token,
            }),
        });

        if (!response.ok) {
            const { status } = response;
            const {
                rtlError,
                usernameError,
                emailError,
                turnstileError,
            } = getStylesErrorData({
                status: status,
                headers: response.headers,
            });

            setTurnstileKey(
                handleTurnstileReset({
                    key: turnstileKey,
                    status: status,
                }),
            );

            setStyles((draft) => {
                draft.rtl = rtlError;
                draft.username = usernameError;
                draft.email = emailError;
                draft.turnstile = turnstileError;
            });
            setIsLoading(false);

            return;
        }

        const emailLetterId = (await response.json())?.id;
        const routeParams = `?username=${username}&email=${email}&id=${emailLetterId}`;

        setIsLoading(false);
        router.push(PAGE_ROUTES.VERIFICATION + routeParams);
    }

    function handleTurnstileVerification({
        status,
        isError,
        errorText,
    }: {
        status: TurnstileStatusType;
        isError: boolean;
        errorText: string;
    }) {
        setTurnstileStatus(status);
        setStyles((draft) => {
            draft.turnstile = {
                error: isError,
                text: errorText,
            };
        });
    }

    return (
        <GeneralForm token={token} initialHeight="665">
            <div className="h-fit w-full max-w-[464px] bg-zinc-100 drop-shadow-xl rounded-md">
                <div className="py-6 px-12 rounded-md drop-shadow-sm bg-white">
                    <div className="flex flex-col items-center gap-4">
                        <SquareAsterisk
                            color="black"
                            size={32}
                        />
                        <p className="text-center text-xl font-bold text-black">
                            Регистрация
                        </p>
                        <p className="text-center text-gray-500 font-medium">
                            Добро пожаловать! Зарегистрируйтесь, чтобы продолжить.
                        </p>
                        <div className="w-full flex flex-nowrap items-center gap-2">
                            <OAuth2Providers />
                        </div>
                        <div
                            className="w-full flex flex-nowrap items-center gap-4"
                        >
                            <div className="w-full h-[1px] bg-gray-200"/>
                            <p className="text-zinc-700">
                                или
                            </p>
                            <div className="w-full h-[1px] bg-gray-200"/>
                        </div>
                        <form
                            className="w-full flex flex-col gap-4"
                            onSubmit={(event: FormEvent<HTMLFormElement>) => handleSubmit(event)}
                            method="POST"
                        >
                            <div className="flex flex-col gap-2">
                                <p className={`font-semibold text-zinc-800`}>
                                    Никнейм
                                </p>
                                <input
                                    maxLength={128}
                                    className={`${(styles.username.error) ? "focus:outline-red-200 hover:border-red-200 border-red-200" : "focus:outline-gray-300 hover:border-gray-300 border-gray-200"} h-8 shadow-sm focus:-outline-offset-0 outline-transparent focus:outline-none border-[1px] rounded-md px-2 py-1 transition-all text-black`}
                                    type={"text"}
                                    name={"username"}
                                    placeholder=""
                                    defaultValue={usernamePlaceholder as string}
                                    required
                                />
                                {
                                    (styles.username.error) && (
                                        <AlertBlock>
                                            {styles.username.text}
                                        </AlertBlock>
                                    )
                                }
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className={`font-semibold text-zinc-800`}>
                                    Почта
                                </p>
                                <input
                                    maxLength={254}
                                    className={`${(styles.email.error) ? "focus:outline-red-200 hover:border-red-200 border-red-200" : "focus:outline-gray-300 hover:border-gray-300 border-gray-200"} h-8 shadow-sm focus:-outline-offset-0 outline-transparent focus:outline-none border-[1px] rounded-md px-2 py-1 transition-all text-black`}
                                    type={"email"}
                                    name={"email"}
                                    placeholder=""
                                    defaultValue={emailPlaceholder as string}
                                    required
                                />
                                {
                                    (styles.email.error) && (
                                        <AlertBlock>
                                            {styles.email.text}
                                        </AlertBlock>
                                    )
                                }
                            </div>
                            {
                                (styles.rtl.error) && (
                                    <AlertBlock>
                                        {styles.rtl.text}
                                    </AlertBlock>
                                )
                            }
                            <ConfiguredTurnstile
                                key={turnstileKey}
                                onError={() => handleTurnstileVerification({
                                    status: "error",
                                    isError: true,
                                    errorText: STYLES_ERROR_TYPES.TURNSTILE_ERROR,
                                })}
                                onExpire={() => handleTurnstileVerification({
                                    status: "expired",
                                    isError: true,
                                    errorText: STYLES_ERROR_TYPES.TURNSTILE_EXPIRED,
                                })}
                                onLoad={() => handleTurnstileVerification({
                                    status: "required",
                                    isError: false,
                                    errorText: STYLES_ERROR_TYPES.TURNSTILE_REQUIRED,
                                })}
                                onVerify={() => handleTurnstileVerification({
                                    status: "success",
                                    isError: false,
                                    errorText: STYLES_ERROR_TYPES.EMPTY,
                                })}
                            />
                            {
                                (turnstileStatus === "required") && (
                                    <AlertBlock tailwindClasses="text-orange-400 justify-center">
                                        {STYLES_ERROR_TYPES.TURNSTILE_REQUIRED}
                                    </AlertBlock>
                                )
                            }
                            {
                                (styles.turnstile.error) && (
                                    <AlertBlock>
                                        {styles.turnstile.text}
                                    </AlertBlock>
                                )
                            }
                            {
                                isLoading ? (
                                    <div
                                        className="h-[40px] w-full transition animate-pulse bg-zinc-400 rounded-md"/>
                                ) : (
                                    <button
                                        className={`hover:bg-zinc-700 bg-zinc-800 transition rounded-md p-2 text-white h-[40px]`}
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
                        Уже есть аккаунт?{' '}
                        <Link
                            className="text-black font-medium transition hover:text-zinc-700"
                            href={"/login"}
                        >
                            Войдите
                        </Link>
                    </p>
                </div>
            </div>
        </GeneralForm>
    );
}