"use client";

import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from "react";
import { TableSessionType } from "@/db/schema";
import ProfileSession from "@/components/account/Profile/ProfileSession/ProfileSession";

export default function VirtualizedList({
    data,
    queryKey,
}: {
    data: {
        sessions: TableSessionType[];
    };
    queryKey: string[];
}) {
    const parentRef = useRef(null);
    const rowVirtualizer = useVirtualizer({
        count: data.sessions.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 72,
    });

    return (
        <>
            <div
                ref={parentRef}
                style={{
                    height: `calc(100vh - 64px)`,
                    overflow: 'auto', // Make it scroll!
                }}
            >
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualItem) => (
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
                            <ProfileSession
                                mutationKey={queryKey}
                                removable={true}
                                { ...data.sessions[virtualItem.index] }
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}