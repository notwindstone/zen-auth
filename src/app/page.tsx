import {Form} from "@/components/Form/Form";
import Link from "next/link";

export default function Home() {
    return (
        <main className="p-10">
            <div className="mx-auto flex flex-col gap-4 max-w-lg">
                <div className="mb-4">
                    <p className="text-2xl font-bold">
                        Главная
                    </p>
                    <a
                        target="_blank"
                        className="text-zinc-500 transition hover:text-black"
                        href="https://github.com/notwindstone/authless-next-demo"
                    >
                        Github репозиторий
                    </a>
                </div>
                <Form type="sign-up"/>
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
