export const REGISTRATION_INPUTS = [
    {
        label: "Имя пользователя",
        type: "text",
        name: "username",
    },
    {
        label: "Почта",
        type: "email",
        name: "email",
    },
    {
        label: "Пароль",
        type: "password",
        name: "password",
    },
];
export const LOGIN_INPUTS = [
    {
        label: "Почта",
        type: "email",
        name: "email",
        error: "Почта (неправильная почта или пароль)",
    },
    {
        label: "Пароль",
        type: "password",
        name: "password",
        error: "Пароль (неправильная почта или пароль)",
    },
];
export const LOGIN_ERRORS = {
    INCORRECT_PASSWORD: "Неверный пароль",
};