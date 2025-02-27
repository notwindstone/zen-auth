"use client";

import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@/configs/api";

export default function Profile({
    userId,
}: {
    userId: string | undefined;
}) {
    const {
        isPending,
        error,
        data,
        failureCount,
        failureReason,
    } = useQuery({
        queryKey: [API_ROUTES.session.current, userId],
        queryFn: async () => {
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
            return !(Number(error.message) === 401 || failureCount > 3);
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