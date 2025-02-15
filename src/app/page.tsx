import {Form} from "@/components/Form";
import Link from "next/link";

export default function Home() {
    return (
        <main className="p-10 space-y-5">
            <p className="italic max-w-xl">
                <u>How to test</u>: Login and refresh the page to see iron-session in
                action. Bonus: open multiple tabs to see the state being reflected by
                SWR automatically.
            </p>

            <div className="grid grid-cols-1 gap-4 p-10 border border-slate-500 rounded-md max-w-xl">
                <Form />
                <div className="space-y-2">
                    <hr/>
                    <p>
                        The following pages are protected and will redirect back here if
                        you&apos;re not logged in:
                    </p>
                    {/* convert the following paragraphs into an ul li */}
                    <ul className="list-disc list-inside">
                        <li>
                            <Link
                                href="/protected"
                            >
                                Protected page via client component →
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <p>
                <Link href="/">
                    ← All examples
                </Link>
            </p>
        </main>
    );
}
