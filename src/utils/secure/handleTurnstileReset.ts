import { v4 as uuid } from "uuid";
import { API_STATUS_CODES } from "@/configs/api";

export default function handleTurnstileReset({
    status,
    key,
}: {
    status: number;
    key: string;
}) {
    switch (status) {
        case API_STATUS_CODES.SERVER.NETWORK_AUTHENTICATION_REQUIRED:
            return uuid();
        case API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR:
            return uuid();
        case API_STATUS_CODES.ERROR.CONFLICT:
            return uuid();
        case API_STATUS_CODES.ERROR.NOT_FOUND:
            return uuid();
        default:
            return key;
    }
}