"use client";

import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@/configs/api";
import VirtualizedList from "@/components/misc/VirtualizedList/VirtualizedList";

export default function Page() {
    const queryKey = [API_ROUTES.SESSION.ALL];
    const {
        isPending,
        error,
        data,
    } = useQuery({
        queryKey: queryKey,
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
            <VirtualizedList
                data={data}
                queryKey={queryKey}
            />
        </div>
    );
}