export const API_ROUTES = {
    session: {
        current: "/api/session/current",
        all: "/api/session/all",
    },
    profile: "/api/profile",
    login: "/api/login",
};
export const API_STATUS_CODES = {
    SUCCESS: {
        OK: 200,
    },
    ERROR: {
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        TOO_MANY_REQUESTS: 429,
    },
};