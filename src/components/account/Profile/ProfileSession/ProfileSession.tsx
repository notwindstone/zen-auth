import { TableSessionType, TableUserType } from "@/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlatformName } from "@/utils/misc/getPlatformName";
import { Cpu, LaptopMinimal, Monitor, MonitorCog, Smartphone } from "lucide-react";
import { useState } from "react";

export default function ProfileSession({
    id,
    expiresAt,
    architecture,
    browser,
    ipAddress,
    lastSignedIn,
    os,
    mutationKey,
    removable,
}: TableSessionType & {
    mutationKey: Array<string | undefined>;
    removable?: boolean;
}) {
    const [currentState, setCurrentState] = useState({
        isLoading: false,
        isError: false,
    });
    const [success, setSuccess] = useState(false);
    const isRemoved = ipAddress === "removed";
    const queryClient = useQueryClient();
    const {
        mutate,
    } = useMutation({
        mutationKey: mutationKey,
        mutationFn: async (sessionId: string) => {
            if (currentState.isLoading) {
                setCurrentState((prev) => {
                    return {
                        ...prev,
                        isError: true,
                    };
                });

                return sessionId;
            }

            setCurrentState((prev) => {
                return {
                    ...prev,
                    isLoading: true,
                };
            });

            console.log(sessionId);

            setCurrentState({
                isError: false,
                isLoading: false,
            });

            return sessionId;
        },
        onSuccess: async (sessionId: string) => {
            queryClient.setQueryData(mutationKey, (oldData: {
                sessions: TableSessionType[];
            } | {
                session: TableSessionType;
                user: TableUserType;
            }) => {
                if ('sessions' in oldData) {
                    if (currentState.isError) {
                        return oldData;
                    }

                    const foundIndex = oldData.sessions.findIndex((oldSession: TableSessionType) => {
                        return oldSession.id === sessionId;
                    });
                    oldData.sessions[foundIndex] = {
                        architecture: "removed",
                        browser: "removed",
                        ipAddress: "removed",
                        expiresAt: new Date(),
                        os: oldData.sessions[foundIndex].os,
                        lastSignedIn: new Date(),
                        id: "removed",
                        userId: "removed",
                    };
                    setSuccess(true);

                    return {
                        sessions: oldData.sessions,
                    };
                }

                return {
                    user: oldData.user,
                    session: null,
                };
            });
        },
    });

    if (
        !id
        || !expiresAt
        || !architecture
        || !browser
        || !ipAddress
        || !lastSignedIn
        || !os
    ) {
        return;
    }

    let icon;

    switch (getPlatformName(os)) {
        case "windows":
            icon = <Monitor size={48} />;
            break;
        case "phone":
            icon = <Smartphone size={48} />;
            break;
        case "linux":
            icon = <MonitorCog size={48} />;
            break;
        case "mac":
            icon = <LaptopMinimal size={48} />;
            break;
        case "unknown":
        default:
            icon = <Cpu size={48} />;
            break;
    }

    return (
        <div
            className="flex flex-nowrap"
            style={(success || isRemoved) ? {
                color: "#ff6961",
            } : undefined}
        >
            <div className="flex justify-center items-center w-[72px] h-[72px]">
                {icon}
            </div>
            <div className="flex flex-col">
                {
                    (!isRemoved && !success) ? (
                        <>
                            <p className="font-semibold">
                                {ipAddress}
                            </p>
                            <p className="text-zinc-200">
                                {os}, {browser}, {architecture}
                            </p>
                            <p className="text-zinc-500">
                                {lastSignedIn.toString()}, {expiresAt.toString()}
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="font-semibold h-full flex flex-col justify-center">
                                This session was removed
                            </p>
                        </>
                    )
                }
            </div>
            {
                (!isRemoved && !success && removable) && (
                    <button
                        onClick={async () => {
                            mutate(id);
                        }}
                    >
                        remove
                    </button>
                )
            }
        </div>
    );
}