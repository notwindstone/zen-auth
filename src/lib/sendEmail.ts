"use server";

import { Resend } from 'resend';
import {config} from "dotenv";

config({ path: ".env.local" });

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function sendEmail({
    code,
    email,
}: {
    code: string;
    email: string;
}) {
    return resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Email verification',
        html: `<p>Your verification code: ${code}.</p>`
    });
}