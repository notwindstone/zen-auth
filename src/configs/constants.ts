import { API_STATUS_CODES } from "@/configs/api";

export const COOKIES_KEY = "zen_auth_session";
export const NO_RETRY_ERRORS = new Set([
    API_STATUS_CODES.ERROR.UNAUTHORIZED,
    API_STATUS_CODES.ERROR.FORBIDDEN,
    API_STATUS_CODES.ERROR.NOT_FOUND,
    API_STATUS_CODES.ERROR.TOO_MANY_REQUESTS,
]);
export const SPACE_STRING = " ";
export const PUBLIC_AVATAR_URL = "public_user_avatar";
export const RESET_TOKEN_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const PLACEHOLDER_STRING = "no errors";
export const CODE_DIGITS_COUNT = 6;
export const PASSWORD_LENGTH_LIMIT = 128;
export const USERNAME_LENGTH_LIMIT = 128;
export const EMAIL_LENGTH_LIMIT = 254;
export const STYLES_ERROR_TYPES = {
    EMPTY: "",
    SOMETHING_WENT_WRONG: "Что-то пошло не так...",
    RETRY_AFTER: "Было отправлено слишком большое количество запросов. Попробуйте ещё раз через",
    NICKNAME_FORMAT: "Ошибка в формате никнейма.",
    EMAIL_FORMAT: "Ошибка в формате почты.",
    PASSWORD_FORMAT: "Ошибка в формате пароля.",
    CODE_FORMAT: "Ошибка в формате кода.",
    NICKNAME_IN_USE: "Никнейм занят. Попробуйте другой.",
    EMAIL_IN_USE: "Такая почта уже используется. Попробуйте другую.",
    USER_EXISTS: "Такой пользователь уже существует. Попробуйте ввести другой никнейм или почту.",
    NO_NICKNAME: "Никнейм не был указан.",
    NO_EMAIL: "Почта не была указана.",
    NO_LOGIN: "Никнейм и/или почта не были указаны.",
    NO_CODE: "Код не был указан или указан неверно.",
    NO_PASSWORD: "Пароль не был указан.",
    CODE_FAIL: "Неверный код",
    TURNSTILE_REQUIRED: "Пожалуйста, пройдите капчу.",
    TURNSTILE_EXPIRED: "Превышено время ожидания. Попробуйте ещё раз.",
    TURNSTILE_ERROR: "Верификация не удалась. Попробуйте ещё раз.",
    CREDENTIALS_ERROR: "Неверный логин или пароль.",
    EMAIL_NOT_FOUND: "Пользователя с такой почтой не существует.",
    WRONG_RESET_TOKEN: "Неверный токен сброса пароля.",
    SERVICE_UNAVAILABLE: "Сервер перегружен. Повторите попытку чуть позже.",
};
export const STYLES_ERROR_INITIAL_DATA = {
    error: false,
    text: STYLES_ERROR_TYPES.EMPTY,
};
export const SECONDS_RUSSIAN: [
    string,
    string,
    string,
] = ["секунда", "секунды", "секунд"];
export const SECONDS_RUSSIAN_AFTER: [
    string,
    string,
    string,
] = ["секунду", "секунды", "секунд"];
export const DIGITS_ARRAY = [0,1,2,3,4,5,6,7,8,9];