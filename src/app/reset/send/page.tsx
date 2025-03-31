import SendResetCode from "@/components/forms/SendResetCode/SendResetCode";
import WrapperBlock from "@/components/misc/WrapperBlock/WrapperBlock";

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | null }>;
}) {
    const searchParamsStore = await searchParams;
    const email = searchParamsStore?.email ?? undefined;

    return (
        <WrapperBlock>
            <SendResetCode emailFromParams={email} />
        </WrapperBlock>
    );
}