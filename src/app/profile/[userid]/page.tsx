import Profile from "@/components/Profile/Profile";

export default async function Page({
    params,
}: {
    params: Promise<{
        userid: string;
    }>
}) {
    const { userid } = await params;

    return (
        <>
            <Profile userId={userid} />
        </>
    );
}