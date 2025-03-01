import {TableSessionType} from "@/db/schema";

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
                    {browser}, {architecture}
                </p>
                <p className="text-zinc-500">
                    {lastSignedIn.toString()}, {expiresAt.toString()}
                </p>
            </div>
            <button
                onClick={async () => {

                }}
            >
                remove
            </button>
        </div>
    );
}