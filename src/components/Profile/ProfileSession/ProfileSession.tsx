import {TableSessionType} from "@/db/schema";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {API_ROUTES} from "@/configs/api";

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

    return (
        <div className="flex gap-4 flex-nowrap">
            <div className="flex justify-center items-center w-12 h-12">
                {os}
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