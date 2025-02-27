import Profile from "@/components/Profile/Profile";

export default async function Page({
    params,
}: {
    params: Promise<{
        username: string;
    }>
}) {
    const { username } = await params;

    return (
        <>
            <Profile username={username} />
        </>
    );
}