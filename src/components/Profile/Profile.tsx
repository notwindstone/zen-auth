"use client";

import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@/configs/api";

export default function Profile() {
    const {
        isPending,
        error,
        data,
        failureCount,
        failureReason,
    } = useQuery({
        queryKey: [API_ROUTES.session],
        queryFn: async () => {
            const response = await fetch(API_ROUTES.session);

            if (!response.ok) {
                return Promise.reject(
                    new Error(
                        response.status.toString(),
                    ),
                );
            }

            return await response.json();
        },
        retry: 3,
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
                            {failureCount} retries. Possible error: {failureReason?.message}
                        </p>
                    )
                }
            </div>
        );
    }

    if (error) {
        return 'An error has occurred: ' + error.message;
    }

    return (
        <div>
            {JSON.stringify(data)}
        </div>
    );
}