import { CircleAlert } from "lucide-react";

export default function AlertBlock({
    children,
    tailwindClasses = "text-red-400",
}: {
    children: React.ReactNode;
    tailwindClasses?: string;
}) {
    return (
        <div className={`${tailwindClasses} text-sm flex gap-2 items-center`}>
            <CircleAlert className="shrink-0" size={20} />
            <p>
                {children}
            </p>
        </div>
    );
}