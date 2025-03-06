"use client";

import Image from "next/image";
import Link from "next/link";
import nextJsLogo from '../../../public/vercel.svg';

export default function LoginForm() {


    return (
        <div className="bg-white drop-shadow-xl py-6 px-12 rounded-md">
            <div className="flex flex-col items-center gap-4">
                <Image
                    className="mb-4"
                    width={48}
                    height={48}
                    src={nextJsLogo}
                    alt={"Next.js logo"}
                />
                <p className="text-center text-xl font-bold text-black">
                    Авторизация
                </p>
                <p className="text-center text-gray-500 font-medium">
                    Добро пожаловать! Войдите, чтобы продолжить.
                </p>
                <div className="h-[1px] w-full bg-gray-200"/>
                <form
                    className="w-full flex flex-col gap-4"
                    onSubmit={() => {}}
                    method="POST"
                >
                    <div className="flex flex-col gap-2">
                        <p className={`font-semibold text-gray-800`}>
                            dfgh
                        </p>
                        <input
                            className={`shadow-sm focus:outline-gray-300 focus:-outline-offset-0 outline-transparent focus:outline-none hover:border-gray-300 border-gray-200 border-[1px] rounded-md px-2 py-1 transition-all text-black`}
                            type={"asdf"}
                            name={"asdf"}
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
                <p className="text-center text-gray-500 font-medium">
                    Ещё нет аккаунта?{' '}
                    <Link
                        className="text-black font-medium"
                        href={""}
                    >
                        Зарегистрируйтесь
                    </Link>
                </p>
            </div>
        </div>
    );
}