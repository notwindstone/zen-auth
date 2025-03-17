import SendResetCode from "@/components/SendResetCode/SendResetCode";

export default function Page() {

    return (
        <>
            <SendResetCode/>
            <div>
                ссылка с токеном сброса была отправлена на почту. перейдите по ней.
            </div>
        </>
    );
}