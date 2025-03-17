"use client";

import { getLastEmailInfo } from "@/lib/actions/email";
import Link from "next/link";

export default function ResetCodeSent({
    emailLetterId,
}: {
    emailLetterId: string;
}) {
    async function checkEmailStatus() {
        alert(await getLastEmailInfo({ id: emailLetterId }));
    }

    return (
        <>
            <div className="py-4 flex flex-col gap-2">
                <p className="text-center text-gray-500 font-medium">
                    Не пришла ссылка?{' '}
                    <button
                        className="text-black font-medium transition hover:text-zinc-700"
                        onClick={checkEmailStatus}
                    >
                        Проверьте статус письма
                    </button>
                </p>
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
                        href={"/reset/send"}
                    >
                        Отправьте код ещё раз
                    </Link>
                </p>
            </div>
        </>
    );
}