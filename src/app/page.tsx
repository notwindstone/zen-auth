import {Form} from "@/components/Form";
import Link from "next/link";

export default function Home() {
    return (
        <main className="p-10 space-y-5">
            <div className="flex flex-col gap-4 max-w-lg">
                <Form type="sign-up" />
                <Link
                    className="text-center hover:bg-zinc-700 bg-zinc-800 focus:bg-zinc-600 text-white rounded-md py-2 px-4 transition"
                    href="/protected"
                >
                    Перейти на защищённую страницу
                </Link>
            </div>
        </main>
    );
}
