"use client";

import { useQuery } from "@tanstack/react-query";

export default function Page() {
    const {
        isPending,
        error,
        data,
    } = useQuery({
        queryKey: ["sessions"],
        queryFn: async () => {
            const response = await fetch(`/api/session/all`);

            if (!response.ok) {
                return Promise.reject(
                    new Error(
                        response.status.toString(),
                    ),
                );
            }

            return await response.json();
        },
    });

    if (isPending) {
        return <div>Loading...asdfjlasdkjf;lkasdjf;l</div>;
    }

    if (error) {
        return <div>Error</div>;
    }

    return (
        <div>
            {JSON.stringify(data)}
        </div>
    );
}