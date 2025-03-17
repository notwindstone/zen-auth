import ResetCodeSent from "@/components/ResetCodeSent/ResetCodeSent";

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | null }>;
}) {
    const searchParamsStore = await searchParams;
    const emailLetterId = searchParamsStore?.emailLetterId ?? null;

    if (!emailLetterId) {
        return (
            <>
                something went wrong...
            </>
        );
    }

    return (
        <>
            <div>
                ссылка с токеном сброса была отправлена на почту. перейдите по ней.
            </div>
            <ResetCodeSent />
        </>
    );
}