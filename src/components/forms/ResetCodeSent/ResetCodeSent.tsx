"use client";

import { getLastEmailInfo } from "@/lib/actions/email";
import Link from "next/link";
import { useState } from "react";
import translateEmailStatus from "@/utils/misc/translateEmailStatus";
import { PAGE_ROUTES } from "@/configs/pages";

export default function ResetCodeSent({
    emailLetterId,
}: {
    emailLetterId: string;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [emailLetterData, setEmailLetterData] = useState({
        show: false,
        status: "",
    });

    async function checkEmailStatus() {
        if (isLoading) {
            return;
        }

        setIsLoading(true);
        setEmailLetterData({
            show: true,
            status: "",
        });

        const emailStatus = await getLastEmailInfo({ id: emailLetterId as string });

        setEmailLetterData({
            show: true,
            status: translateEmailStatus({ status: emailStatus }),
        });
        setIsLoading(false);
    }

    return (
        <div className="w-fit flex flex-col gap-4">
            <div className="bg-white w-fit px-12 rounded-md border-[1px] border-gray-200 py-4 flex flex-col gap-2">
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
                    {/* lmao i'm too lazy to do another handleResend() function */}
                    <Link
                        className="text-black font-medium transition hover:text-zinc-700"
                        href={PAGE_ROUTES.RESET.SEND}
                    >
                        Отправьте код ещё раз
                    </Link>
                </p>
            </div>
            {
                emailLetterData.show && (
                    <>
                        {
                            isLoading ? (
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
                    </>
                )
            }
        </div>
    );
}