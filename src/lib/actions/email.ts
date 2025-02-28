"use server";

import { Resend } from 'resend';
import { config } from "dotenv";

config({ path: ".env.local" });

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendVerificationCodeEmail({
    code,
    email,
    username,
}: {
    code: string;
    email: string;
    username: string;
}) {
    return resend.emails.send({
        from: 'Zen-Auth <onboarding@windstone.space>',
        to: email,
        subject: 'Верификация Email',
        html: `<p>Добро пожаловать, ${username}. Ваш код подтверждения: ${code}.</p>`,
    });
}

export async function sendResetCodeEmail({
    code,
    email,
}: {
    code: string;
    email: string;
}) {
    return resend.emails.send({
        from: 'Zen-Auth <onboarding@windstone.space>',
        to: email,
        subject: 'Сброс пароля',
        html: `<p>Используйте этот код, чтобы сбросить пароль для вашей учетной записи. Ваш код подтверждения: ${code}.</p>`,
    });
}

export async function getLastEmailInfo({
    id,
}: {
    id: string;
}) {
    return resend.emails.get(id);
}