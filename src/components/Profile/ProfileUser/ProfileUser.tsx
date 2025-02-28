import { TableUserType } from "@/db/schema";

export default function ProfileUser({
    id,
    username,
    displayName,
    avatarUrl,
    email,
    createdAt,
    lastSignedIn,
}: TableUserType) {
    return (
        <div>
            {id}{username}
        </div>
    );
}