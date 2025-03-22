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