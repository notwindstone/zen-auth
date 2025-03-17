import ResetPassword from "@/components/ResetPassword/ResetPassword";

export default function Page() {

    return (
        <>
            <ResetPassword/>
            <div>
                ссылка с токеном сброса была отправлена на почту. перейдите по ней.
            </div>
        </>
    );
}