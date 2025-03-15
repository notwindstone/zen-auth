import { API_STATUS_CODES } from "@/configs/api";

export const COOKIES_KEY = "zen_auth_session";
export const NO_RETRY_ERRORS = new Set([
    API_STATUS_CODES.ERROR.UNAUTHORIZED,
    API_STATUS_CODES.ERROR.FORBIDDEN,
    API_STATUS_CODES.ERROR.NOT_FOUND,
    API_STATUS_CODES.ERROR.TOO_MANY_REQUESTS,
]);
export const PUBLIC_AVATAR_URL = "public_user_avatar";
export const RESET_TOKEN_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const PLACEHOLDER_STRING = "no errors";