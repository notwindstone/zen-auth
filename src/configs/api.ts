export const API_ROUTES = {
    login: "/api/login",
    profile: "/api/profile",
    reset: "/api/reset",
    session: {
        all: "/api/session/all",
        current: "/api/session/current",
    },
    verification: "/api/verification",
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
    },
};