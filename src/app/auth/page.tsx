import Link from "next/link";

export default function Page() {
    return (
        <div className="p-10 space-y-5">
            <p>Доступ к странице возможен только зарегистрированным пользователям!</p>
            <Link href={"/"}>
                ← Назад
            </Link>
        </div>
    );
}