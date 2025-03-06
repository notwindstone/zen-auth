import { TableSessionType } from "@/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ROUTES } from "@/configs/api";
import { getPlatformName } from "@/utils/misc/getPlatformName";
import { Cpu, LaptopMinimal, Monitor, MonitorCog, Smartphone } from "lucide-react";

export default function ProfileSession({
    id,
    expiresAt,
    architecture,
    browser,
    ipAddress,
    lastSignedIn,
    userId,
    os,
}: TableSessionType) {
    const queryClient = useQueryClient();
    const {
        mutate,
    } = useMutation({
        mutationKey: [API_ROUTES.session.all],
        mutationFn: async (sessionId: string) => {

            return sessionId;
        },
        onSuccess: async (sessionId: string) => {
            queryClient.setQueryData([API_ROUTES.session.all], (oldData: {
                sessions: TableSessionType[];
            }) => {
                return {
                    sessions: oldData.sessions.filter((oldSession: TableSessionType) => {
                        return oldSession.id !== sessionId;
                    }),
                };
            });
        },
    });

    let icon;

    switch (getPlatformName(os)) {
    // sorry for the 4 spaces instead of 8, eslint is going insane
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
            <button
                onClick={async () => {
                    mutate(id);
                }}
            >
                remove
            </button>
        </div>
    );
}