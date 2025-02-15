import SignIn from "@/components/SignIn/SignIn";
import Link from "next/link";

export default function Page() {
    return (
        <div>
            <SignIn />
            <Link href={"/"}>
                Домой
            </Link>
        </div>
    );
}