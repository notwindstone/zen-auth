export const API_ROUTES = {
    LOGIN: "/api/login",
    PROFILE: "/api/profile",
    RESET: "/api/reset",
    SESSION: {
        ALL: "/api/session/all",
        CURRENT: "/api/session/current",
        SPECIFIC: "/api/session/specific",
    },
    VERIFICATION: "/api/verification",
};
export const API_STATUS_CODES = {
    SUCCESS: {
        OK: 200,
    },
    ERROR: {
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        IM_A_TEAPOT: 418,
        TOO_MANY_REQUESTS: 429,
    },
    SERVER: {
        INTERNAL_SERVER_ERROR: 500,
        SERVICE_UNAVAILABLE: 503,
        NETWORK_AUTHENTICATION_REQUIRED: 511,
    },
};
export const API_REQUEST_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
};
export const OAUTH2_API_BASES = {
    GITHUB: "https://api.github.com",
};
export const OAUTH2_API_ROUTES = {
    GITHUB: {
        USER: OAUTH2_API_BASES.GITHUB + "/user",
    },
};
export const OAUTH2_REDIRECT_ERROR_URL_PARAMS = "error_url";
export const OAUTH2_ERROR_BASE_PARAMS = "oauth_error";
export const OAUTH2_RTL_PARAMS = "oauth_rtl";
export const OAUTH2_BAD_REQUEST_PARAMS = "oauth_bad_request";
export const OAUTH2_INTERNAL_SERVER_ERROR_PARAMS = "oauth_internal_server_error";
export const OAUTH2_USER_EXISTS_PARAMS = "oauth_user_exists";