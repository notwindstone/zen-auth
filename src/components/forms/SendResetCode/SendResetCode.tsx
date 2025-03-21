"use client";

import { FormEvent, useState } from "react";
import { RectangleEllipsis } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import AlertBlock from "@/components/misc/AlertBlock/AlertBlock";
import { STYLES_ERROR_INITIAL_DATA, STYLES_ERROR_TYPES } from "@/configs/constants";
import ConfiguredTurnstile from "@/components/forms/ConfiguredTurnstile/ConfiguredTurnstile";
import { TurnstileStatusType } from "@/types/Auth/TurnstileStatus.type";
import { useImmer } from "use-immer";
import { StylesErrorType } from "@/types/UI/StylesError.type";
import validateEmail from "@/utils/secure/validateEmail";
import { API_REQUEST_METHODS, API_ROUTES } from "@/configs/api";
import getStylesErrorData from "@/utils/queries/getStylesErrorData";
import { PAGE_ROUTES } from "@/configs/pages";

export default function SendResetCode() {
    const router = useRouter();
    const [turnstileStatus, setTurnstileStatus] = useState<TurnstileStatusType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [styles, setStyles] = useImmer<
        Pick<
            StylesErrorType,
            "rtl" | "email" | "turnstile"
        >
    >({
        rtl: STYLES_ERROR_INITIAL_DATA,
        email: STYLES_ERROR_INITIAL_DATA,
        turnstile: STYLES_ERROR_INITIAL_DATA,
    });

    async function handleResetCode(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isLoading) {
            return;
        }

        setIsLoading(true);
        setStyles((draft) => {
            draft.rtl = STYLES_ERROR_INITIAL_DATA;
            draft.email = STYLES_ERROR_INITIAL_DATA;
        });

        if (turnstileStatus !== "success") {
            setIsLoading(false);

            return;
        }

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");

        if (!email) {
            setStyles((draft) => {
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

        const response = await fetch(API_ROUTES.RESET, {
            method: API_REQUEST_METHODS.POST,
            body: JSON.stringify({
                email: email,
            }),
        });

        if (!response.ok) {
            const { status } = response;
            const {
                rtlError,
                emailError,
                turnstileError,
            } = getStylesErrorData({
                status: status,
                headers: response.headers,
            });

            setStyles((draft) => {
                draft.rtl = rtlError;
                draft.email = emailError;
                draft.turnstile = turnstileError;
            });
            setIsLoading(false);

            return;
        }

        const emailLetterId = (await response.json())?.id;
        const routeParams = `?emailLetterId=${emailLetterId}`;

        setIsLoading(false);
        router.push(PAGE_ROUTES.RESET.EMAILED + routeParams);
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
        <>
            <div className="h-fit w-full max-w-[464px] bg-zinc-100 drop-shadow-xl rounded-md">
                <div className="py-6 px-12 rounded-md drop-shadow-sm bg-white">
                    <div className="flex flex-col items-center gap-4">
                        <RectangleEllipsis
                            color="black"
                            size={32}
                        />
                        <p className="text-center text-xl font-bold text-black">
                            Сброс пароля
                        </p>
                        <p className="text-center text-gray-500 font-medium">
                            Введите почту, чтобы отправить ссылку на сброс пароля.
                        </p>
                        <div className="w-full h-[1px] bg-gray-200"/>
                        <form
                            className="w-full flex flex-col gap-4"
                            onSubmit={(event: FormEvent<HTMLFormElement>) => handleResetCode(event)}
                            method="POST"
                        >
                            <div className="flex flex-col gap-2">
                                <p className={`font-semibold text-zinc-800`}>
                                    Почта
                                </p>
                                <input
                                    maxLength={254}
                                    className={`${(styles.email.error) ? "focus:outline-red-200 hover:border-red-200 border-red-200" : "focus:outline-gray-300 hover:border-gray-300 border-gray-200"} h-8 shadow-sm focus:-outline-offset-0 outline-transparent focus:outline-none border-[1px] rounded-md px-2 py-1 transition-all text-black`}
                                    type={"text"}
                                    name={"email"}
                                    placeholder=""
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
            </div>
        </>
    );
}