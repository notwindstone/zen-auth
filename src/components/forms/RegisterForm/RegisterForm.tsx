"use client";

import { useRouter } from "nextjs-toploader/app";
import { API_ROUTES } from "@/configs/api";
import { STYLES_ERROR_INITIAL_DATA, STYLES_ERROR_TYPES } from "@/configs/constants";
import { FormEvent, useState } from "react";
import { CircleAlert, SquareAsterisk } from "lucide-react";
import Link from "next/link";
import validateEmail from "@/utils/secure/validateEmail";
import { StylesErrorType } from "@/types/UI/StylesError.type";
import { useImmer } from "use-immer";
import GeneralForm from "@/components/forms/GeneralForm/GeneralForm";
import getStylesErrorData from "@/utils/queries/getStylesErrorData";
import { PAGE_ROUTES } from "@/configs/pages";

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
    const [isLoading, setIsLoading] = useState(false);
    const [styles, setStyles] = useImmer<
        Pick<
            StylesErrorType,
            "rtl" | "username" | "email"
        >
    >({
        rtl: STYLES_ERROR_INITIAL_DATA,
        username: STYLES_ERROR_INITIAL_DATA,
        email: STYLES_ERROR_INITIAL_DATA,
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

        const formData = new FormData(event.currentTarget);
        const username = formData.get("username");
        const email = formData.get("email");

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
                    text: "Почта введена в неверном формате.",
                };
            });
            setIsLoading(false);

            return;
        }

        const response = await fetch(API_ROUTES.VERIFICATION, {
            method: "POST",
            body: JSON.stringify({
                username: username,
                email: email,
            }),
        });

        if (!response.ok) {
            const { status } = response;
            const {
                rtlError,
                usernameError,
                emailError,
            } = getStylesErrorData({
                status: status,
                headers: response.headers,
            });

            setStyles((draft) => {
                draft.rtl = rtlError;
                draft.username = usernameError;
                draft.email = emailError;
            });
            setIsLoading(false);

            return;
        }

        const emailLetterId = (await response.json())?.id;
        const routeParams = `?username=${username}&email=${email}&id=${emailLetterId}`;

        setIsLoading(false);
        router.push(PAGE_ROUTES.VERIFICATION + routeParams);
    }

    return (
        <GeneralForm token={token}>
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
                                        <div className="text-red-400 text-sm flex gap-2 items-center">
                                            <CircleAlert className="shrink-0" size={20}/>
                                            <p>
                                                {styles.username.text}
                                            </p>
                                        </div>
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
                                        <div className="text-red-400 text-sm flex gap-2 items-center">
                                            <CircleAlert className="shrink-0" size={20}/>
                                            <p>
                                                {styles.email.text}
                                            </p>
                                        </div>
                                    )
                                }
                            </div>
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