export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | null }>;
}) {
    const searchParamsStore = await searchParams;
    const token = searchParamsStore?.token ?? null;

    if (!token) {
        return (
            <>
                something went wrong...
            </>
        );
    }

    return (
        <>
        </>
    );
}