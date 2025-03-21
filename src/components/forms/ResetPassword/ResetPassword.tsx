"use client";

import { KeyRound } from "lucide-react";
import { FormEvent, useState } from "react";
import PasswordInput from "@/components/forms/Inputs/PasswordInput/PasswordInput";
import AlertBlock from "@/components/misc/AlertBlock/AlertBlock";
import { useImmer } from "use-immer";
import { StylesErrorType } from "@/types/UI/StylesError.type";
import { STYLES_ERROR_INITIAL_DATA, STYLES_ERROR_TYPES } from "@/configs/constants";
import { useRouter } from "nextjs-toploader/app";
import { API_REQUEST_METHODS, API_ROUTES } from "@/configs/api";
import getStylesErrorData from "@/utils/queries/getStylesErrorData";
import { setSessionTokenCookie } from "@/lib/actions/cookies";
import { getMonthForwardDate } from "@/utils/misc/getMonthForwardDate";
import { PAGE_ROUTES } from "@/configs/pages";

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [styles, setStyles] = useImmer<
        Pick<
            StylesErrorType,
            "rtl" | "email" | "password"
        >
    >({
        rtl: STYLES_ERROR_INITIAL_DATA,
        email: STYLES_ERROR_INITIAL_DATA,
        password: STYLES_ERROR_INITIAL_DATA,
    });

    async function handlePasswordReset(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isLoading) {
            return;
        }

        setIsLoading(true);
        setStyles((draft) => {
            draft.rtl = STYLES_ERROR_INITIAL_DATA;
            draft.email = STYLES_ERROR_INITIAL_DATA;
            draft.password = STYLES_ERROR_INITIAL_DATA;
        });

        const formData = new FormData(event.currentTarget);
        const password = formData.get("password");

        if (!password || !email) {
            setStyles((draft) => {
                draft.email = {
                    error: !Boolean(email),
                    text: STYLES_ERROR_TYPES.NO_EMAIL,
                };
                draft.password = {
                    error: !Boolean(password),
                    text: STYLES_ERROR_TYPES.NO_PASSWORD,
                };
            });
            setIsLoading(false);

            return;
        }

        const resetResponse = await fetch(API_ROUTES.RESET, {
            method: API_REQUEST_METHODS.PUT,
            body: JSON.stringify({
                email: email,
                newPassword: password,
                resetToken: token,
            }),
        });

        if (!resetResponse.ok) {
            const { status } = resetResponse;
            const {
                rtlError,
                passwordError,
            } = getStylesErrorData({
                status: status,
                headers: resetResponse.headers,
            });

            setStyles((draft) => {
                draft.rtl = rtlError;
                draft.password = passwordError;
            });
            setIsLoading(false);

            return;
        }

        const loginResponse = await fetch(API_ROUTES.LOGIN, {
            method: API_REQUEST_METHODS.POST,
            body: JSON.stringify({
                login: email,
                password: password,
            }),
        });

        if (!loginResponse.ok) {
            const { status } = loginResponse;
            const {
                rtlError,
                emailError,
                passwordError,
            } = getStylesErrorData({
                status: status,
                headers: loginResponse.headers,
            });

            setStyles((draft) => {
                draft.rtl = rtlError;
                draft.email = emailError;
                draft.password = passwordError;
            });
            setIsLoading(false);

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
                            {
                                (styles.email.error) && (
                                    <AlertBlock>
                                        {styles.email.text}
                                    </AlertBlock>
                                )
                            }
                            <PasswordInput
                                isError={styles.password.error}
                                errorText={styles.password.text}
                            />
                            {
                                (styles.password.error) && (
                                    <AlertBlock>
                                        {styles.password.text}
                                    </AlertBlock>
                                )
                            }
                            {
                                (styles.rtl.error) && (
                                    <AlertBlock>
                                        {styles.rtl.text}
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