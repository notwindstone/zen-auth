import Link from "next/link";

export default function Page() {
    return (
        <div>
            <p>
                Successfully logged in.
            </p>
            <Link href={"/"}>
                Back
            </Link>
        </div>
    );
}