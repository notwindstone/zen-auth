import { TableSessionType, TableUserType } from "@/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlatformName } from "@/utils/misc/getPlatformName";
import { Cpu, LaptopMinimal, Monitor, MonitorCog, Smartphone, X } from "lucide-react";
import { useState } from "react";
import { API_REQUEST_METHODS, API_ROUTES, API_STATUS_CODES } from "@/configs/api";

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
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [success, setSuccess] = useState(false);
    const isRemoved = ipAddress === "removed";
    const queryClient = useQueryClient();
    const {
        mutate,
    } = useMutation({
        mutationKey: mutationKey,
        mutationFn: async (sessionId: string) => {
            setIsError(false);

            if (isLoading) {
                return API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR.toString();
            }

            setIsLoading(true);

            const response = await fetch(API_ROUTES.SESSION.SPECIFIC, {
                method: API_REQUEST_METHODS.DELETE,
                body: JSON.stringify({
                    sessionId: sessionId,
                }),
            });

            if (!response.ok) {
                setIsLoading(false);

                return API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR.toString();
            }

            setIsLoading(false);

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
                    if (sessionId === API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR.toString()) {
                        setIsError(true);

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

    if (isLoading) {
        return (
            <div className="w-[560px] h-[88px] border-[1px] border-zinc-500 bg-zinc-900 rounded-md animate-pulse" />
        );
    }

    return (
        <div
            className="bg-zinc-900 border-[1px] border-zinc-500 min-w-[560px] h-[88px] w-fit rounded-md flex flex-nowrap items-center"
            style={(success || isRemoved) ? {
                color: "#ff9090",
            } : undefined}
        >
            <div className="flex justify-center items-center w-[72px] h-[72px] flex-shrink-0">
                {icon}
            </div>
            <div className="flex flex-col flex-shrink-0">
                {
                    (!isRemoved && !success) ? (
                        <>
                            <p className="font-semibold">
                                {ipAddress}
                                {isError && " ~~~ There was an error..."}
                            </p>
                            <p className="text-zinc-200">
                                {os}, {browser}, {architecture}
                            </p>
                            <p className="text-zinc-500">
                                Последний вход {(new Date(lastSignedIn)).toLocaleDateString("ru-RU", {
                                    dateStyle: "medium",
                                })}
                                {", "}
                                Истекает {(new Date(expiresAt)).toLocaleDateString("ru-RU", {
                                    dateStyle: "medium",
                                })}
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="font-semibold h-full flex flex-col justify-center">
                                Сессия была завершена
                            </p>
                        </>
                    )
                }
            </div>
            {
                (!isRemoved && !success && removable) && (
                    <div
                        className="py-2 px-5 w-full h-fit flex justify-end"
                    >
                        <button
                            className="text-white hover:text-zinc-500 transition"
                            onClick={async () => {
                                mutate(id);
                            }}
                        >
                            <X size={24} />
                        </button>
                    </div>
                )
            }
        </div>
    );
}