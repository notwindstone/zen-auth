import SignUp from "@/components/SignUp/SignUp";
import Link from "next/link";

export default function Page() {
    return (
        <div>
            <SignUp />
            <Link href={"/"}>
                Домой
            </Link>
        </div>
    );
}