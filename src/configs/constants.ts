import {API_STATUS_CODES} from "@/configs/api";

export const COOKIES_KEY = "zen_auth_session";
export const NO_RETRY_ERRORS = new Set([
    API_STATUS_CODES.ERROR.UNAUTHORIZED,
    API_STATUS_CODES.ERROR.FORBIDDEN,
    API_STATUS_CODES.ERROR.NOT_FOUND,
]);