import Link from "next/link";
import {Form} from "@/components/Form";

export default function Page() {
    return (
        <div>
            <Form type="sign-in" />
            <Link href={"/"}>
                Домой
            </Link>
        </div>
    );
}