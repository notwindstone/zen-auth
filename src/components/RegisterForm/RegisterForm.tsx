"use client";

import { useRouter } from "nextjs-toploader/app";
import { useQuery } from "@tanstack/react-query";
import { API_ROUTES, API_STATUS_CODES } from "@/configs/api";
import { TableSessionType, TableUserType } from "@/db/schema";
import { NO_RETRY_ERRORS } from "@/configs/constants";
import { FormEvent, useState } from "react";
import { CircleAlert, SquareAsterisk } from "lucide-react";
import Link from "next/link";
import validateEmail from "@/utils/secure/validateEmail";
import { StylesErrorType } from "@/types/StylesError.type";
import { useImmer } from "use-immer";

export default function RegisterForm({
    token,
    usernamePlaceholder,
    emailPlaceholder,
}: {
    token: string;
    usernamePlaceholder: string;
    emailPlaceholder: string;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [styles, setStyles] = useImmer<Pick<StylesErrorType, "username" | "email">>({
        username: {
            error: false,
            text: "",
        },
        email: {
            error: false,
            text: "",
        },
    });
    const router = useRouter();
    const {
        isPending,
        error,
        failureCount,
        failureReason,
    } = useQuery({
        queryKey: [API_ROUTES.session.current, token],
        queryFn: async (): Promise<{
            session: TableSessionType;
            user: TableUserType;
        }> => {
            const response = await fetch(API_ROUTES.session.current);

            if (!response.ok) {
                return Promise.reject(
                    new Error(
                        response.status.toString(),
                    ),
                );
            }

            return await response.json();
        },
        retry: (failureCount, error) => {
            return !(NO_RETRY_ERRORS.has(Number(error.message)) || failureCount > 3);
        },
    });

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        setIsLoading(true);
        setStyles(draft => {
            draft.username = {
                error: false,
                text: "",
            };
            draft.email = {
                error: false,
                text: "",
            };
        });

        const formData = new FormData(event.currentTarget);
        const username = formData.get("username");
        const email = formData.get("email");

        if (!username || !email) {
            setStyles(draft => {
                draft.username = {
                    error: Boolean(username),
                    text: "Никнейм не был указан.",
                };
                draft.email = {
                    error: Boolean(email),
                    text: "Почта не была указана.",
                };
            });
            setIsLoading(false);

            return;
        }

        const isValidEmail = validateEmail({ email });

        if (!isValidEmail) {
            setStyles(draft => {
                draft.email = {
                    error: true,
                    text: "Почта введена в неверном формате.",
                };
            });
            setIsLoading(false);

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
            const { status } = response;

            let usernameError = {
                error: false,
                text: "",
            };
            let emailError = {
                error: false,
                text: "",
            };

            switch (status) {
                case API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR:
                    usernameError = {
                        error: true,
                        text: "Что-то пошло не так...",
                    };
                    emailError = {
                        error: true,
                        text: "Что-то пошло не так...",
                    };

                    break;
                case API_STATUS_CODES.ERROR.TOO_MANY_REQUESTS:
                    const remaining = response.headers.get('Retry-After');

                    usernameError = {
                        error: true,
                        text: `Было отправлено слишком большое количество запросов. Попробуйте ещё раз через ${remaining} секунд!`,
                    };
                    emailError = {
                        error: true,
                        text: `Было отправлено слишком большое количество запросов. Попробуйте ещё раз через ${remaining} секунд!`,
                    };

                    break;
                case API_STATUS_CODES.ERROR.BAD_REQUEST:
                    usernameError = {
                        error: true,
                        text: "Ошибка в формате никнейма.",
                    };
                    emailError = {
                        error: true,
                        text: "Ошибка в формате почты.",
                    };

                    break;
                case API_STATUS_CODES.ERROR.CONFLICT:
                    const { statusText } = response;

                    switch (statusText) {
                        case "username":
                            usernameError = {
                                error: true,
                                text: "Никнейм занят. Попробуйте другой.",
                            };

                            break;
                        case "email":
                            emailError = {
                                error: true,
                                text: "Такая почта уже используется. Попробуйте другую.",
                            };

                            break;
                    }

                    break;
                default:
                    usernameError = {
                        error: true,
                        text: "Что-то пошло не так...",
                    };
                    emailError = {
                        error: true,
                        text: "Что-то пошло не так...",
                    };

                    break;
            }

            setStyles(draft => {
                draft.username = usernameError;
                draft.email = emailError;
            });
            setIsLoading(false);

            return;
        }

        const emailLetterId = (await response.json())?.id;

        setIsLoading(false);

        router.push(`/verification?username=${username}&email=${email}&id=${emailLetterId}`);
    }

    if (isPending) {
        return (
            <div>
                <p>
                    Loading...
                </p>
                {
                    failureCount > 0 && (
                        <p>
                            {failureCount} retries. Current error: {failureReason?.message}
                        </p>
                    )
                }
            </div>
        );
    }

    if (error?.message === API_STATUS_CODES.ERROR.UNAUTHORIZED.toString()) {
        return (
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
                                            <CircleAlert className="shrink-0" size={20} />
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
                                            <CircleAlert className="shrink-0"  size={20} />
                                            <p>
                                                {styles.email.text}
                                            </p>
                                        </div>
                                    )
                                }
                            </div>
                            {
                                isLoading ? (
                                    <div className="h-[40px] w-full mt-2 transition animate-pulse bg-zinc-400 rounded-md" />
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
        );
    }

    if (error) {
        return (
            <div>
                <p>
                    An error has occurred: {error.message}
                </p>
            </div>
        );
    }


    return (
        <div>
            <p>
                You are logged in.
            </p>
        </div>
    );
}