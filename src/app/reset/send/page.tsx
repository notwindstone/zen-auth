import SendResetCode from "@/components/forms/SendResetCode/SendResetCode";

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | null }>;
}) {
    const searchParamsStore = await searchParams;
    const email = searchParamsStore?.email ?? undefined;

    return (
        <>
            <SendResetCode emailFromParams={email} />
        </>
    );
}