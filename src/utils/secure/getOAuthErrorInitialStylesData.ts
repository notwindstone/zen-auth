import { STYLES_ERROR_TYPES } from "@/configs/constants";
import {
    OAUTH2_BAD_REQUEST_PARAMS,
    OAUTH2_INTERNAL_SERVER_ERROR_PARAMS,
    OAUTH2_RTL_PARAMS, OAUTH2_USER_EXISTS_PARAMS,
} from "@/configs/api";

export default function getOAuthErrorInitialStylesData(error: string) {
    switch (error) {
        case OAUTH2_BAD_REQUEST_PARAMS:
            return {
                error: true,
                text: STYLES_ERROR_TYPES.OAUTH2_BAD_REQUEST,
            };
        case OAUTH2_RTL_PARAMS:
            return {
                error: true,
                text: STYLES_ERROR_TYPES.SERVICE_UNAVAILABLE,
            };
        case OAUTH2_USER_EXISTS_PARAMS:
            return {
                error: true,
                text: STYLES_ERROR_TYPES.OAUTH2_USER_EXISTS,
            };
        case OAUTH2_INTERNAL_SERVER_ERROR_PARAMS:
            return {
                error: true,
                text: STYLES_ERROR_TYPES.INTERNAL_SERVER_ERROR,
            };
        default:
            return {
                error: false,
                text: STYLES_ERROR_TYPES.EMPTY,
            };
    }
}