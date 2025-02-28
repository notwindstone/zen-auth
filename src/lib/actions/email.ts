"use server";

import { Resend } from 'resend';
import { config } from "dotenv";

config({ path: ".env.local" });

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function sendEmail({
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