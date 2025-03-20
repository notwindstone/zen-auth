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

    switch (status) {
        case API_STATUS_CODES.SERVER.INTERNAL_SERVER_ERROR:
            usernameError = {
                error: true,
                text: STYLES_ERROR_TYPES.SOMETHING_WENT_WRONG,
            };
            emailError = {
                error: true,
                text: STYLES_ERROR_TYPES.SOMETHING_WENT_WRONG,
            };

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
                text: STYLES_ERROR_TYPES.FORMAT,
            };
            emailError = {
                error: true,
                text: STYLES_ERROR_TYPES.FORMAT,
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
        default:
            usernameError = {
                error: true,
                text: STYLES_ERROR_TYPES.SOMETHING_WENT_WRONG,
            };
            emailError = {
                error: true,
                text: STYLES_ERROR_TYPES.SOMETHING_WENT_WRONG,
            };

            break;
    }

    return {
        rtlError,
        usernameError,
        emailError,
    };
}