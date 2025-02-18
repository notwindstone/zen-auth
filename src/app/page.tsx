import {Form} from "@/components/Form/Form";
import Link from "next/link";

export default function Home() {
    return (
        <main className="p-10">
            <div className="flex flex-col gap-4 max-w-lg">
                <p className="text-2xl font-bold mb-4">
                    Главная
                </p>
                <Form type="sign-up" />
                <Link
                    className="text-center hover:bg-zinc-700 bg-zinc-800 focus:bg-zinc-600 text-white rounded-md py-2 px-4 transition"
                    href="/protected"
                >
                    Перейти в профиль
                </Link>
            </div>
        </main>
    );
}
