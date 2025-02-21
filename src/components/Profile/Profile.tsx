"use client";

import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@/configs/api";

export default function Profile() {
    const { isPending, error, data } = useQuery({
        queryKey: [API_ROUTES.session],
        queryFn: async () => {
            const response = await fetch(API_ROUTES.session);

            if (response.status !== 200) {
                return Promise.reject(
                    new Error(
                        `${response.status} ${response.statusText}`,
                    ),
                );
            }

            return await response.json();
        },
    });

    if (isPending) {
        return 'Loading...';
    }

    if (error) {
        return 'An error has occurred: ' + error.message;
    }

    return (
        <div>
            {data?.user?.username}
        </div>
    );
}