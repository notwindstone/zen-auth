import { CircleAlert } from "lucide-react";
import { CODE_DIGITS_COUNT, DIGITS_ARRAY } from "@/configs/constants";
import { useRef, useState } from "react";

export default function OTPInput({
    isError,
    errorText,
}: {
    isError: boolean;
    errorText: string;
}) {
    const [otp, setOtp] = useState<Array<string | number>>(
        Array(CODE_DIGITS_COUNT).fill(""),
    );
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    function handleChange(index: number, value: string) {
        if (!DIGITS_ARRAY.includes(Number(value))) {
            return;
        }

        setOtp((prevOtp: Array<string | number>) => {
            const newOtp = [...prevOtp];

            newOtp[index] = value.replace(/[^0-9]/g, "");

            return newOtp;
        });

        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleBackspace(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
        if (!event.target || !('value' in event.target)) {
            return;
        }

        if (event.key === "Backspace" && !event.target.value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
        event.preventDefault();

        const clipboardValue = event.clipboardData.getData("text/plain") as string;
        const trimmedValue = clipboardValue.trim();

        if (isNaN(Number(trimmedValue))) {
            return;
        }

        const newOtp = trimmedValue.split('');
        const slicedOtp = newOtp.slice(0, 6);

        for (let i = slicedOtp.length; i < otp.length; i++) {
            slicedOtp.push("");
        }

        setOtp(slicedOtp);
    }

    return (
        <div className="flex flex-col gap-2">
            <p className={`font-semibold text-zinc-800`}>
                Код
            </p>
            <div className="flex w-full gap-2">
                {
                    otp.map((digit, index) => {
                        return (
                            <input
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                autoFocus={index === 0}
                                key={index}
                                className={`${(isError) ? "focus:outline-red-200 hover:border-red-200 border-red-200" : "focus:outline-gray-300 hover:border-gray-300 border-gray-200"} h-16 w-full text-center shadow-sm focus:-outline-offset-0 outline-transparent focus:outline-none border-[1px] rounded-md transition-all text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                type={"text"}
                                name={`code_${index}`}
                                placeholder=""
                                pattern="\d*"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleBackspace(index, e)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
                                onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => handlePaste(e)}
                                required
                            />
                        );
                    })
                }
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