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
        <div>
            {id}{expiresAt.toString()}
        </div>
    );
}