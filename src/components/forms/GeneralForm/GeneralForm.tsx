"use client";

import { API_ROUTES, API_STATUS_CODES } from "@/configs/api";
import { useQuery } from "@tanstack/react-query";
import querySessionCurrent from "@/utils/queries/querySessionCurrent";
import handleFailure from "@/utils/queries/handleFailure";

export default function GeneralForm({
    FormNode,
    token,
}: {
    FormNode: React.ReactNode;
    token: string;
}) {
    const {
        isPending,
        error,
        failureCount,
        failureReason,
    } = useQuery({
        queryKey: [API_ROUTES.session.current, token],
        queryFn: querySessionCurrent,
        retry: handleFailure,
    });

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
            { FormNode }
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