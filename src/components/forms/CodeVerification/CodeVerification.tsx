"use client";

import { Signature } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { API_REQUEST_METHODS, API_ROUTES, API_STATUS_CODES } from "@/configs/api";
import { useRouter } from "nextjs-toploader/app";
import { getLastEmailInfo } from "@/lib/actions/email";
import { setSessionTokenCookie } from "@/lib/actions/cookies";
import { getMonthForwardDate } from "@/utils/misc/getMonthForwardDate";
import {
    CODE_DIGITS_COUNT,
    STYLES_ERROR_INITIAL_DATA,
    STYLES_ERROR_TYPES,
} from "@/configs/constants";
import PasswordInput from "@/components/forms/Inputs/PasswordInput/PasswordInput";
import validateEmail from "@/utils/secure/validateEmail";
import translateEmailStatus from "@/utils/misc/translateEmailStatus";
import { useImmer } from "use-immer";
import { StylesErrorType } from "@/types/UI/StylesError.type";
import { PAGE_ROUTES } from "@/configs/pages";
import GeneralForm from "@/components/forms/GeneralForm/GeneralForm";
import OTPInput from "@/components/forms/Inputs/OTPInput/OTPInput";
import { OTPContext } from "@/utils/contexts/Contexts";
import getStylesErrorData from "@/utils/queries/getStylesErrorData";
import AlertBlock from "@/components/misc/AlertBlock/AlertBlock";
import ConfiguredTurnstile from "@/components/forms/ConfiguredTurnstile/ConfiguredTurnstile";
import { TurnstileStatusType } from "@/types/Auth/TurnstileStatus.type";
import { v4 as uuid } from "uuid";
import handleTurnstileReset from "@/utils/secure/handleTurnstileReset";

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
    const [turnstileKey, setTurnstileKey] = useState<string>(uuid);
    const turnstileToken = useRef<string | null | undefined>(null);
    const [turnstileStatus, setTurnstileStatus] = useState<TurnstileStatusType | null>(null);
    const [isResend, setIsResend] = useState(false);
    const [otp, setOtp] = useState<Array<string | number>>(
        Array(CODE_DIGITS_COUNT).fill(""),
    );
    const [isLoading, setIsLoading] = useState({
        submit: false,
        email: false,
    });
    const [emailLetterData, setEmailLetterData] = useState({
        show: false,
        status: "",
    });
    const [styles, setStyles] = useImmer<
        Pick<
            StylesErrorType,
            "rtl" | "username" | "email" | "code" | "password" | "turnstile"
        >
    >({
        rtl: STYLES_ERROR_INITIAL_DATA,
        username: STYLES_ERROR_INITIAL_DATA,
        email: STYLES_ERROR_INITIAL_DATA,
        code: STYLES_ERROR_INITIAL_DATA,
        password: STYLES_ERROR_INITIAL_DATA,
        turnstile: STYLES_ERROR_INITIAL_DATA,
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

        if (!isResend) {
            setIsResend(true);

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
            draft.turnstile = STYLES_ERROR_INITIAL_DATA;
        });

        if (turnstileStatus !== "success") {
            setIsLoading({
                submit: false,
                email: false,
            });

            return;
        }

        const token = turnstileToken.current;

        if (!token) {
            setStyles((draft) => {
                draft.turnstile = {
                    error: true,
                    text: STYLES_ERROR_TYPES.TURNSTILE_ERROR,
                };
            });
            setIsLoading({
                submit: false,
                email: false,
            });

            return;
        }

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
            setIsLoading({
                submit: false,
                email: false,
            });

            return;
        }

        const emailLetterId = (await response.json())?.id;
        const routeParams = `?username=${username}&email=${email}&id=${emailLetterId}`;

        router.push(PAGE_ROUTES.VERIFICATION + routeParams);

        setTurnstileKey(uuid());
        setIsResend(false);
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
            setStyles((draft) => {
                draft.email = {
                    error: !Boolean(email) || !Boolean(emailLetterId),
                    text: STYLES_ERROR_TYPES.NO_EMAIL,
                };
                draft.password = {
                    error: !Boolean(password),
                    text: STYLES_ERROR_TYPES.NO_PASSWORD,
                };
            });
            setIsLoading({
                submit: false,
                email: false,
            });

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
            setIsLoading({
                submit: false,
                email: false,
            });

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
            const { status } = verificationResponse;
            const {
                rtlError,
                emailError,
                usernameError,
                codeError,
                passwordError,
            } = getStylesErrorData({
                status: status,
                headers: verificationResponse.headers,
            });

            setStyles((draft) => {
                draft.rtl = rtlError;
                draft.email = emailError;
                draft.code = codeError;

                if (status !== API_STATUS_CODES.ERROR.UNAUTHORIZED) {
                    draft.password = passwordError;
                }

                if (status === API_STATUS_CODES.ERROR.CONFLICT) {
                    draft.username = usernameError;
                }
            });
            setIsLoading({
                submit: false,
                email: false,
            });

            return;
        }

        const loginResponse = await fetch(API_ROUTES.LOGIN, {
            method: API_REQUEST_METHODS.POST,
            body: JSON.stringify({
                login: username,
                password: password,
            }),
        });

        if (!loginResponse.ok) {
            router.push(PAGE_ROUTES.LOGIN);

            setIsLoading({
                submit: false,
                email: false,
            });

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
                            <OTPContext.Provider value={{
                                OTPValue: otp,
                                setOTPValue: setOtp,
                                isError: styles.code.error,
                                errorText: styles.code.text,
                            }}>
                                <OTPInput />
                            </OTPContext.Provider>
                            <PasswordInput isError={styles.password.error} errorText={styles.password.text} />
                            {
                                (styles.rtl.error) && (
                                    <AlertBlock>
                                        {styles.rtl.text}
                                    </AlertBlock>
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
                    <div className="flex flex-col text-center text-gray-500 font-medium">
                        <button
                            className="text-black font-medium transition hover:text-zinc-700"
                            onClick={handleResend}
                        >
                            {
                                isResend ? (
                                    "Отправить код ещё раз"
                                ) : (
                                    "Пройдите капчу для его повторной отправки"
                                )
                            }
                        </button>
                    </div>
                    {
                        isResend && (
                            <div className="w-full px-12 py-2">
                                <div
                                    className="rounded-md w-full h-32 bg-white border-[1px] border-gray-200 flex flex-col items-center justify-center text-center text-lg font-semibold text-black gap-2"
                                >
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
                                        onVerify={(token?: string) => {
                                            handleTurnstileVerification({
                                                status: "success",
                                                isError: false,
                                                errorText: STYLES_ERROR_TYPES.EMPTY,
                                            });
                                            turnstileToken.current = token;
                                        }}
                                    />
                                    {
                                        (turnstileStatus === "required") && (
                                            <AlertBlock tailwindClasses="text-orange-400 justify-center">
                                                {STYLES_ERROR_TYPES.TURNSTILE_REQUIRED}
                                            </AlertBlock>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                    {
                        (styles.turnstile.error) && (
                            <AlertBlock tailwindClasses="text-red-400 justify-center">
                                {styles.turnstile.text}
                            </AlertBlock>
                        )
                    }
                    {
                        (styles.username.error) && (
                            <div className="px-12">
                                <AlertBlock tailwindClasses="text-red-400 justify-center">
                                    {styles.username.text ?? styles.email.text}
                                </AlertBlock>
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