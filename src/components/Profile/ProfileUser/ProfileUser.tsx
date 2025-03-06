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
    console.log(displayName, avatarUrl, email, createdAt, lastSignedIn);

    return (
        <div>
            {id}{username}
        </div>
    );
}