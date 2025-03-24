import { TableUserType } from "@/db/schema";
import Image from "next/image";
import { PUBLIC_AVATAR_URL } from "@/configs/constants";

export default function ProfileUser({
    id,
    username,
    displayName,
    avatarUrl,
    email,
    createdAt,
    lastSignedIn,
}: TableUserType) {
    const data = [
        {
            text: "User ID",
            value: id,
        },
        {
            text: "Email",
            value: email,
        },
        {
            text: "Last Signed In",
            value: new Date(lastSignedIn).toLocaleDateString("en-US", {
                dateStyle: "medium",
            }),
        },
        {
            text: "Account Created",
            value: new Date(createdAt).toLocaleDateString("en-US", {
                dateStyle: "medium",
            }),
        },
    ];
    
    return (
        <div>
            <div className="flex w-fit p-4 bg-zinc-100 rounded-md text-zinc-900 gap-4 items-start">
                <Image
                    className="rounded-md w-16 h-16"
                    src={avatarUrl === PUBLIC_AVATAR_URL ? "/favicon.ico" : avatarUrl}
                    alt={`${username}'s avatar profile`}
                    height={64}
                    width={64}
                />
                <div className="flex flex-col">
                    <div className="flex flex-nowrap gap-2 items-center">
                        <p className="text-lg font-semibold">
                            {displayName}
                        </p>
                        <p className="text-gray-600">
                            @{username}
                        </p>
                    </div>
                    {
                        data.map(({
                            text,
                            value,
                        }) => {
                            // now i understand why Zod exists...
                            if (!value) {
                                return;
                            }

                            return (
                                <p key={text} className="text-sm text-gray-400">
                                    {text}: {value}
                                </p>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}