"use client";

import Link from "next/link";
import { Shield } from "lucide-react";

export default function LoginForm() {


    return (
        <div className="h-fit w-fit bg-zinc-100 drop-shadow-xl rounded-md">
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
                        onSubmit={() => {
                        }}
                        method="POST"
                    >
                        <div className="flex flex-col gap-2">
                            <p className={`font-semibold text-zinc-800`}>
                                Почта
                            </p>
                            <input
                                className={`shadow-sm focus:outline-gray-300 focus:-outline-offset-0 outline-transparent focus:outline-none hover:border-gray-300 border-gray-200 border-[1px] rounded-md px-2 py-1 transition-all text-black`}
                                type={"email"}
                                name={"email"}
                                placeholder=""
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className={`font-semibold text-zinc-800`}>
                                Пароль
                            </p>
                            <input
                                className={`shadow-sm focus:outline-gray-300 focus:-outline-offset-0 outline-transparent focus:outline-none hover:border-gray-300 border-gray-200 border-[1px] rounded-md px-2 py-1 transition-all text-black`}
                                type={"password"}
                                name={"email"}
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
            <div className="py-4">
                <p className="text-center text-gray-500 font-medium">
                    Ещё нет аккаунта?{' '}
                    <Link
                        className="text-black font-medium transition hover:text-zinc-700"
                        href={""}
                    >
                        Зарегистрируйтесь
                    </Link>
                </p>
            </div>
        </div>
    );
}