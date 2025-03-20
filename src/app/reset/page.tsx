import ResetPassword from "@/components/forms/ResetPassword/ResetPassword";

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | null }>;
}) {
    const searchParamsStore = await searchParams;
    const token = searchParamsStore?.token ?? null;
    const email = searchParamsStore?.email ?? null;

    if (!token || !email) {
        return (
            <>
                something went wrong...
            </>
        );
    }

    return (
        <>
            <ResetPassword token={token} email={email} />
        </>
    );
}