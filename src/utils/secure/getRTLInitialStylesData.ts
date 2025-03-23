import { STYLES_ERROR_INITIAL_DATA, STYLES_ERROR_TYPES } from "@/configs/constants";

export default function getRTLInitialStylesData(isError: boolean) {
    if (isError) {
        return {
            error: true,
            text: STYLES_ERROR_TYPES.SERVICE_UNAVAILABLE,
        };
    }

    return STYLES_ERROR_INITIAL_DATA;
}