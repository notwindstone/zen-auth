import Link from "next/link";
import {Form} from "@/components/Form/Form";

export default function Page() {
    return (
        <main className="p-10">
            <div className="mx-auto flex flex-col gap-4 max-w-lg">
                <Form type="sign-up"/>
                <div className="flex gap-2">
                    <Link
                        className="flex-1 text-center hover:bg-zinc-700 bg-zinc-800 focus:bg-zinc-600 text-white rounded-md py-2 px-4 transition"
                        href="/protected"
                    >
                        Профиль
                    </Link>
                    <Link
                        className="flex-1 text-center hover:bg-zinc-700 bg-zinc-800 focus:bg-zinc-600 text-white rounded-md py-2 px-4 transition"
                        href="/"
                    >
                        Главная
                    </Link>
                </div>
            </div>
        </main>
    );
}