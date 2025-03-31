import ResetCodeSent from "@/components/forms/ResetCodeSent/ResetCodeSent";
import WrapperBlock from "@/components/misc/WrapperBlock/WrapperBlock";

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
        <WrapperBlock>
            <div className="flex flex-col items-center">
                <p>
                    Ссылка с токеном сброса была отправлена на почту.
                </p>
                <p>
                    Перейдите по ней.
                </p>
            </div>
            <ResetCodeSent
                emailLetterId={emailLetterId}
                email={email}
            />
        </WrapperBlock>
    );
}