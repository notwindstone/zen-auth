import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { defaultSession, sessionOptions } from "@/lib/sessions";
import { sleep, SessionData } from "@/lib/sessions";
import { v4 as generateUUID } from 'uuid';
import {createUser} from "@/queries/insert";
import bcrypt from 'bcrypt';
import {updateSessionId} from "@/queries/update";
import {getSessionId} from "@/queries/select";
import {UserData} from "@/types/UserData.type";

export async function POST(request: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    const {
        username = "No username",
        email = "No email",
        password = "No password",
        isSignIn = false,
    } = (await request.json()) as UserData;

    session.isLoggedIn = true;
    session.username = username;
    session.email = email;

    await session.save();

    const sessionId = (await cookies()).get("authless-next-cookies-key-name")?.value ?? "";

    if (isSignIn) {
        const foundSessionId = (await getSessionId(sessionId))?.[0]?.sessionId;

        if (foundSessionId) {
            return Response.json(session);
        }


    }

    const userUUID = generateUUID();
    const saltRounds = 10;

    let hashedPassword: string;
    let saltedPassword: string;

    bcrypt.genSalt(saltRounds, async (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                return Response.error();
            }

            hashedPassword = hash;
            saltedPassword = salt;

            await createUser({
                uuid: userUUID,
                name: username,
                email: email,
                password: hashedPassword,
                salt: saltedPassword,
                sessionId: sessionId,
            });
        });
    });

    return Response.json(session);
}

export async function GET() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.isLoggedIn) {
        return Response.json(defaultSession);
    }

    const sessionId = (await cookies()).get("authless-next-cookies-key-name")?.value ?? "";
    const foundSessionId = (await getSessionId(sessionId))?.[0]?.sessionId;

    if (!foundSessionId) {
        return Response.json(defaultSession);
    }

    return Response.json(session);
}

export async function DELETE() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    const sessionId = (await cookies()).get("authless-next-cookies-key-name")?.value ?? "";

    await updateSessionId(sessionId);
    session.destroy();

    return Response.json(defaultSession);
}