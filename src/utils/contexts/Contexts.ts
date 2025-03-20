import { createContext } from "react";
import { CODE_DIGITS_COUNT } from "@/configs/constants";
import { OTPContextType } from "@/types/Contexts/OTPContext.type";

export const OTPContext = createContext<OTPContextType>({
    OTPValue: Array(CODE_DIGITS_COUNT).fill(""),
    setOTPValue: () => {},
    isError: false,
    errorText: "",
});