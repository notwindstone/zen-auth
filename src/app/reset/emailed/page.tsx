import ResetCodeSent from "@/components/forms/ResetCodeSent/ResetCodeSent";

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | null }>;
}) {
    const searchParamsStore = await searchParams;
    const emailLetterId = searchParamsStore?.emailLetterId ?? null;
    const email = searchParamsStore?.email ?? null;

    if (!emailLetterId || !email) {
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
            <ResetCodeSent
                emailLetterId={emailLetterId}
                email={email}
            />
        </>
    );
}