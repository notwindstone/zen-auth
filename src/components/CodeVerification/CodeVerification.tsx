import { useSearchParams } from "next/navigation";

export default function CodeVerification() {
    const searchParams = useSearchParams();
    const username = searchParams.get("username");
    const email = searchParams.get("email");
    const emailLetterId = searchParams.get("id");

    return (
        <>
            <div>

            </div>
        </>
    );
}