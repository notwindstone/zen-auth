import { Dispatch, SetStateAction } from "react";

export type OTPContextType = {
    OTPValue: Array<string | number>;
    setOTPValue: Dispatch<SetStateAction<Array<string | number>>>;
    isError: boolean;
    errorText: string;
};