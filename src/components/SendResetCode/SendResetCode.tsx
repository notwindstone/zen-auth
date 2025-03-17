"use client";

import { FormEvent } from "react";
import { RectangleEllipsis } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

export default function SendResetCode() {
    const router = useRouter();

    async function handleResetCode(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");

        if (!email) {
            alert("Please enter a valid email");
        }

        const response = await fetch('/api/reset', {
            method: "POST",
            body: JSON.stringify({
                email: email,
            }),
        });

        if (!response.ok) {
            alert('Response is not ok');

            return;
        }

        const responseData = await response.json();

        router.push(`/reset/emailed?emailLetterId=${responseData?.id}`);
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
                                    className={`h-8 shadow-sm focus:outline-gray-300 focus:-outline-offset-0 outline-transparent focus:outline-none hover:border-gray-300 border-gray-200 border-[1px] rounded-md px-2 py-1 transition-all text-black`}
                                    type={"text"}
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
            </div>
        </>
    );
}