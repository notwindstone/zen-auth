"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { setSessionTokenCookie } from "@/lib/actions/cookies";
import { getMonthForwardDate } from "@/utils/misc/getMonthForwardDate";
import { FormEvent, useState } from "react";
import { API_REQUEST_METHODS, API_ROUTES } from "@/configs/api";
import { useRouter } from "nextjs-toploader/app";
import PasswordInput from "@/components/forms/Inputs/PasswordInput/PasswordInput";
import GeneralForm from "@/components/forms/GeneralForm/GeneralForm";
import { PAGE_ROUTES } from "@/configs/pages";
import getStylesErrorData from "@/utils/queries/getStylesErrorData";
import { useImmer } from "use-immer";
import { StylesErrorType } from "@/types/UI/StylesError.type";
import { STYLES_ERROR_INITIAL_DATA, STYLES_ERROR_TYPES } from "@/configs/constants";
import AlertBlock from "@/components/misc/AlertBlock/AlertBlock";

export default function LoginForm({
    token,
}: {
    token: string;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [styles, setStyles] = useImmer<
        Pick<
            StylesErrorType,
            "rtl" | "username" | "password"
        >
    >({
        rtl: STYLES_ERROR_INITIAL_DATA,
        username: STYLES_ERROR_INITIAL_DATA,
        password: STYLES_ERROR_INITIAL_DATA,
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
            draft.password = STYLES_ERROR_INITIAL_DATA;
        });

        const formData = new FormData(event.currentTarget);
        const login = formData.get("login");

        // passwords in the form are provided as plain text.
        // HTTPS will handle everything, no need to encrypt it here.
        // and of course passwords are being stored in database only after hashing and salting
        const password = formData.get("password");

        if (!login || !password) {
            setStyles((draft) => {
                draft.username = {
                    error: !Boolean(login),
                    text: STYLES_ERROR_TYPES.NO_LOGIN,
                };
                draft.password = {
                    error: !Boolean(password),
                    text: STYLES_ERROR_TYPES.NO_PASSWORD,
                };
            });
            setIsLoading(false);

            return;
        }

        const response = await fetch(API_ROUTES.LOGIN, {
            method: API_REQUEST_METHODS.POST,
            body: JSON.stringify({
                login: login,
                password: password,
            }),
        });

        if (!response.ok) {
            const { status } = response;
            const {
                rtlError,
                usernameError,
                passwordError,
            } = getStylesErrorData({
                status: status,
                headers: response.headers,
            });

            setStyles((draft) => {
                draft.rtl = rtlError;
                draft.username = usernameError;
                draft.password = passwordError;
            });
            setIsLoading(false);

            return;
        }

        const data = await response.json();
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
                                    Почта или никнейм
                                </p>
                                <input
                                    maxLength={254}
                                    className={`${(styles.username.error) ? "focus:outline-red-200 hover:border-red-200 border-red-200" : "focus:outline-gray-300 hover:border-gray-300 border-gray-200"} h-8 shadow-sm focus:-outline-offset-0 outline-transparent focus:outline-none border-[1px] rounded-md px-2 py-1 transition-all text-black`}
                                    type={"text"}
                                    name={"login"}
                                    placeholder=""
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
                            <PasswordInput
                                isError={styles.password.error}
                                errorText={styles.password.text}
                            />
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
                <div className="py-4 flex flex-col gap-2">
                    <p className="text-center text-gray-500 font-medium">
                        Ещё нет аккаунта?{' '}
                        <Link
                            className="text-black font-medium transition hover:text-zinc-700"
                            href={"/register"}
                        >
                            Зарегистрируйтесь
                        </Link>
                    </p>
                    <div className="px-12 ">
                        <div className="w-full h-[1px] bg-gray-200"/>
                    </div>
                    <p className="text-center text-gray-500 font-medium">
                        Забыли пароль?{' '}
                        <Link
                            className="text-black font-medium transition hover:text-zinc-700"
                            href="/reset/send"
                        >
                            Сбросьте его
                        </Link>
                    </p>
                </div>
            </div>
        </GeneralForm>
    );
}