"use client";

import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useState } from "react";
import { TableSessionType } from "@/db/schema";
import ProfileSession from "@/components/account/Profile/ProfileSession/ProfileSession";
import { API_REQUEST_METHODS, API_ROUTES, API_STATUS_CODES } from "@/configs/api";

export default function VirtualizedList({
    data,
    queryKey,
}: {
    data: {
        sessions: TableSessionType[];
        currentSessionId: string;
    };
    queryKey: string[];
}) {
    const [sessionsDestroyError, setSessionsDestroyError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const parentRef = useRef(null);
    const rowVirtualizer = useVirtualizer({
        count: data.sessions.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 96,
    });
    const currentSessionId = data.currentSessionId;

    return (
        <>
            <div
                ref={parentRef}
                style={{
                    height: `calc(100vh - 64px)`,
                    overflow: 'auto', // Make it scroll!
                }}
            >
                <div className="text-lg font-semibold">
                    Fetched {data.sessions.length} sessions...
                </div>
                <button
                    onClick={async () => {
                        setIsSuccess(false);
                        setSessionsDestroyError(false);
                        setIsLoading(true);

                        const response = await fetch(API_ROUTES.SESSION.ALL, {
                            method: API_REQUEST_METHODS.DELETE,
                        });

                        if (!response.ok) {
                            setIsLoading(false);

                            return API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR.toString();
                        }

                        setIsLoading(false);
                        setSessionsDestroyError(false);
                        setIsSuccess(true);
                    }}
                >
                    Выйти со всех устройств, кроме этого
                </button>
                <div>
                    {
                        isLoading && "Выходим со всех устройств..."
                    }
                    {
                        sessionsDestroyError && "Возникла ошибка при выходе со всех устройств..."
                    }
                    {
                        isSuccess && `Успешный выход с ${data.sessions.length - 1} устройств!`
                    }
                </div>
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {
                        rowVirtualizer.getVirtualItems().map((virtualItem) => (
                            <div
                                key={virtualItem.key}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualItem.size}px`,
                                    transform: `translateY(${virtualItem.start}px)`,
                                }}
                            >
                                <div className="pt-2 px-2">
                                    <ProfileSession
                                        mutationKey={queryKey}
                                        removable={
                                            data.sessions[virtualItem.index].id !== currentSessionId
                                        }
                                        { ...data.sessions[virtualItem.index] }
                                    />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    );
}