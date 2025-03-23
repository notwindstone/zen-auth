"use client";

import { API_ROUTES, API_STATUS_CODES } from "@/configs/api";
import { useQuery } from "@tanstack/react-query";
import querySessionCurrent from "@/utils/queries/querySessionCurrent";
import handleFailure from "@/utils/queries/handleFailure";

export default function GeneralForm({
    children,
    token,
    initialHeight,
}: {
    children: React.ReactNode;
    token: string;
    initialHeight?: string | number;
}) {
    const {
        isPending,
        error,
        failureCount,
        failureReason,
        data,
    } = useQuery({
        queryKey: [API_ROUTES.SESSION.CURRENT, token],
        queryFn: querySessionCurrent,
        retry: handleFailure,
    });

    if (isPending) {
        return (
            <div className="flex">
                <div
                    style={{
                        height: `${initialHeight}px`,
                    }}
                    className={"w-[464px] bg-zinc-100 drop-shadow-xl rounded-md animate-pulse"}
                />
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

    if (error) {
        return (
            <div>
                <p>
                    An error has occurred: {error.message}
                </p>
            </div>
        );
    }

    if (data === API_STATUS_CODES.ERROR.UNAUTHORIZED) {
        return (
            <>
                {children}
            </>
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