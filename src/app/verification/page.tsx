import CodeVerification from "@/components/forms/CodeVerification/CodeVerification";

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | null }>;
}) {
    const searchParamsStore = await searchParams;
    const username = searchParamsStore?.username ?? null;
    const email = searchParamsStore?.email ?? null;
    const id = searchParamsStore?.id ?? null;

    return (
        <>
            <CodeVerification username={username} email={email} emailLetterId={id} />
        </>
    );
}