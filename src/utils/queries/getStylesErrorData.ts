import {
    SECONDS_RUSSIAN_AFTER,
    SPACE_STRING,
    STYLES_ERROR_INITIAL_DATA,
    STYLES_ERROR_TYPES,
} from "@/configs/constants";
import { API_STATUS_CODES } from "@/configs/api";
import { makeWordEnding } from "@/utils/misc/makeWordEnding";

export default function getStylesErrorData({
    status,
    headers,
}: {
    status: number;
    headers: Headers;
}) {
    let rtlError = STYLES_ERROR_INITIAL_DATA;
    let usernameError = STYLES_ERROR_INITIAL_DATA;
    let emailError = STYLES_ERROR_INITIAL_DATA;
    let passwordError = STYLES_ERROR_INITIAL_DATA;
    let codeError = STYLES_ERROR_INITIAL_DATA;
    let turnstileError = STYLES_ERROR_INITIAL_DATA;

    const somethingWentWrong = {
        error: true,
        text: STYLES_ERROR_TYPES.SOMETHING_WENT_WRONG,
    };

    switch (status) {
        case API_STATUS_CODES.SERVER.SERVICE_UNAVAILABLE:
            rtlError = {
                error: true,
                text: STYLES_ERROR_TYPES.SERVICE_UNAVAILABLE,
            };
            break;
        case API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR:
            usernameError = somethingWentWrong;
            emailError = somethingWentWrong;
            passwordError = somethingWentWrong;
            codeError = somethingWentWrong;

            break;
        case API_STATUS_CODES.ERROR.TOO_MANY_REQUESTS:
            const remaining = headers.get('Retry-After');

            rtlError = {
                error: true,
                text:
                    STYLES_ERROR_TYPES.RETRY_AFTER
                    + SPACE_STRING
                    + remaining
                    + SPACE_STRING
                    + makeWordEnding({
                        count: Number(remaining),
                        wordTypes: SECONDS_RUSSIAN_AFTER,
                    })
                    + "!",
            };

            break;
        case API_STATUS_CODES.ERROR.BAD_REQUEST:
            usernameError = {
                error: true,
                text: STYLES_ERROR_TYPES.NICKNAME_FORMAT,
            };
            emailError = {
                error: true,
                text: STYLES_ERROR_TYPES.EMAIL_FORMAT,
            };
            passwordError = {
                error: true,
                text: STYLES_ERROR_TYPES.PASSWORD_FORMAT,
            };
            codeError = {
                error: true,
                text: STYLES_ERROR_TYPES.CODE_FORMAT,
            };

            break;
        case API_STATUS_CODES.ERROR.CONFLICT:
            const conflictElement = headers.get('X-Zen-Auth-Conflict') ?? "";

            switch (conflictElement) {
                case "username":
                    usernameError = {
                        error: true,
                        text: STYLES_ERROR_TYPES.NICKNAME_IN_USE,
                    };

                    break;
                case "email":
                    emailError = {
                        error: true,
                        text: STYLES_ERROR_TYPES.EMAIL_IN_USE,
                    };

                    break;
                default:
                    usernameError = {
                        error: true,
                        text: STYLES_ERROR_TYPES.USER_EXISTS,
                    };
                    emailError = {
                        error: true,
                        text: STYLES_ERROR_TYPES.USER_EXISTS,
                    };

                    break;
            }

            break;
        case API_STATUS_CODES.ERROR.UNAUTHORIZED:
            codeError = {
                error: true,
                text: STYLES_ERROR_TYPES.CODE_FAIL,
            };
            passwordError = {
                error: true,
                text: STYLES_ERROR_TYPES.WRONG_RESET_TOKEN,
            };

            break;
        case API_STATUS_CODES.ERROR.NOT_FOUND:
            const errorElement = headers.get('X-Zen-Auth-Not-Found') ?? "";

            switch (errorElement) {
                case "login":
                    usernameError = {
                        error: true,
                        text: STYLES_ERROR_TYPES.CREDENTIALS_ERROR_LOGIN,
                    };

                    break;
                case "password":
                    passwordError = {
                        error: true,
                        text: STYLES_ERROR_TYPES.CREDENTIALS_ERROR_PASSWORD,
                    };

                    break;
                default:
                    usernameError = {
                        error: true,
                        text: STYLES_ERROR_TYPES.CREDENTIALS_ERROR,
                    };
                    passwordError = {
                        error: true,
                        text: STYLES_ERROR_TYPES.CREDENTIALS_ERROR,
                    };
                    emailError = {
                        error: true,
                        text: STYLES_ERROR_TYPES.EMAIL_NOT_FOUND,
                    };

                    break;
            }

            break;
        case API_STATUS_CODES.SERVER.NETWORK_AUTHENTICATION_REQUIRED:
            turnstileError = {
                error: true,
                text: STYLES_ERROR_TYPES.TURNSTILE_ERROR,
            };

            break;
        default:
            usernameError = somethingWentWrong;
            emailError = somethingWentWrong;
            passwordError = somethingWentWrong;
            codeError = somethingWentWrong;

            break;
    }

    return {
        rtlError,
        usernameError,
        emailError,
        passwordError,
        codeError,
        turnstileError,
    };
}