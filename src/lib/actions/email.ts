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
    resetToken,
    email,
}: {
    resetToken: string;
    email: string;
}) {
    return resend.emails.send({
        from: 'Zen-Auth <onboarding@windstone.space>',
        to: email,
        subject: 'Сброс пароля',
        html: `<p>Используйте эту ссылку, чтобы сбросить пароль для вашей учетной записи. Ваша ссылка: https://zen-auth.vercel.app/reset?token=${resetToken}&email=${email}.</p>`,
    });
}

export async function getLastEmailInfo({
    id,
}: {
    id: string;
}) {
    return (await resend.emails.get(id))?.data?.['last_event'];
}