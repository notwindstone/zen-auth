import { SessionOptions } from "iron-session";

export interface SessionData {
    username: string;
    isLoggedIn: boolean;
    email: string;
    password?: string | null;
    error?: string;
}

export const defaultSession: SessionData = {
    username: "",
    isLoggedIn: false,
    email: "",
};

export const sessionOptions: SessionOptions = {
    password: "complex_password_at_least_32_characters_long",
    cookieName: "authless-next-cookies-key-name",
    cookieOptions: {
        secure: false,
    },
};