"use client";

import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@/configs/api";
import { NO_RETRY_ERRORS } from "@/configs/constants";

export default function Profile({
    username,
    token,
}: {
    username?: string | undefined;
    token?: string | undefined;
}) {
    const {
        isPending,
        error,
        data,
        failureCount,
        failureReason,
    } = useQuery({
        queryKey: [API_ROUTES.session.current, API_ROUTES.profile, token, username],
        queryFn: async () => {
            let response;

            if (!username) {
                response = await fetch(API_ROUTES.session.current);
            } else {
                response = await fetch(`${API_ROUTES.profile}?username=${username}`);
            }

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
            {JSON.stringify(data)}
        </div>
    );
}