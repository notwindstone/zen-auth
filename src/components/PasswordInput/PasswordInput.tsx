import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

export default function PasswordInput() {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="flex flex-col gap-2">
            <p className={`font-semibold text-zinc-800`}>
                Пароль
            </p>
            <div className="w-full flex items-center gap-2">
                <input
                    className={`h-8 w-full shadow-sm focus:outline-gray-300 focus:-outline-offset-0 outline-transparent focus:outline-none hover:border-gray-300 border-gray-200 border-[1px] rounded-md px-2 py-1 transition-all text-black`}
                    type={isVisible ? "text" : "password"}
                    name={"password"}
                    placeholder=""
                    required
                />
                <button
                    className="shrink-0 bg-zinc-800 rounded-md h-8 w-8 flex justify-center items-center"
                    onClick={() => setIsVisible((state) => !state)}
                >
                    {
                        isVisible ? (
                            <EyeClosed />
                        ) : (
                            <Eye />
                        )
                    }
                </button>
            </div>
        </div>
    );
}