import { useRef, useState } from "react";
import { CircleAlert, Eye, EyeClosed } from "lucide-react";
import { PASSWORD_LENGTH_LIMIT } from "@/configs/constants";

export default function PasswordInput({
    isError,
    errorText,
}: {
    isError: boolean;
    errorText: string;
}) {
    const [isVisible, setIsVisible] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-col gap-2">
            <p className={`font-semibold text-zinc-800`}>
                Пароль
            </p>
            <div className="w-full flex items-center gap-2">
                <input
                    maxLength={128}
                    ref={inputRef}
                    className={`h-8 w-full shadow-sm focus:outline-gray-300 focus:-outline-offset-0 outline-transparent focus:outline-none hover:border-gray-300 border-gray-200 border-[1px] rounded-md px-2 py-1 transition-all text-black`}
                    type={isVisible ? "text" : "password"}
                    name={"password"}
                    placeholder=""
                    required
                    onPaste={(event) => {
                        event.preventDefault();

                        const data = event.clipboardData.getData('text/plain');
                        const currentInput = event.currentTarget.value;

                        if (data.length > PASSWORD_LENGTH_LIMIT || currentInput.length > PASSWORD_LENGTH_LIMIT) {
                            event.currentTarget.value = "";
                            event.currentTarget.placeholder = "Длина пароля превышает 128 символов.";

                            return;
                        }

                        const chars = [ ...data ];
                        const filtered = chars.filter((char) => char !== " ");

                        event.currentTarget.value = currentInput + filtered.join('');
                    }}
                    onKeyDown={(event) => {
                        if (event.key === " ") {
                            event.preventDefault();

                            return;
                        }
                    }}
                />
                <button
                    className="shrink-0 bg-zinc-800 rounded-md h-8 w-8 flex justify-center items-center"
                    onClick={() => {
                        inputRef.current?.focus();
                        setIsVisible((state) => !state);
                    }}
                    type="button"
                >
                    {
                        isVisible ? (
                            <EyeClosed size={20} />
                        ) : (
                            <Eye size={20} />
                        )
                    }
                </button>
            </div>
            {
                (isError) && (
                    <div className="text-red-400 text-sm flex gap-2 items-center">
                        <CircleAlert className="shrink-0" size={20}/>
                        <p>
                            {errorText}
                        </p>
                    </div>
                )
            }
        </div>
    );
}