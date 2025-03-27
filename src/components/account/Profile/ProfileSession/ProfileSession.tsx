import { TableSessionType, TableUserType } from "@/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlatformName } from "@/utils/misc/getPlatformName";
import { Cpu, LaptopMinimal, Monitor, MonitorCog, Smartphone } from "lucide-react";

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
    const queryClient = useQueryClient();
    const {
        mutate,
    } = useMutation({
        mutationKey: mutationKey,
        mutationFn: async (sessionId: string) => {
            console.log(sessionId);

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
                    return {
                        sessions: oldData.sessions.filter((oldSession: TableSessionType) => {
                            return oldSession.id !== sessionId;
                        }),
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
        <div className="flex flex-nowrap">
            <div className="flex justify-center items-center w-[72px] h-[72px]">
                {icon}
            </div>
            <div className="flex flex-col">
                <p className="font-semibold">
                    {ipAddress}
                </p>
                <p className="text-zinc-200">
                    {os}, {browser}, {architecture}
                </p>
                <p className="text-zinc-500">
                    {lastSignedIn.toString()}, {expiresAt.toString()}
                </p>
            </div>
            {
                removable && (
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